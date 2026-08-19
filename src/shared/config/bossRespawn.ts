export type BossName = "Марли" | "Морф" | "Кириос";

export const bosses: BossName[] = ["Марли", "Морф", "Кириос"];

export const respawnWindow = 1; // hours, общий "промежуток" для всех боссов

export const respawnHoursByBoss: Record<BossName, number> = {
  Марли: 12,
  Морф: 12,
  Кириос: 2,
};

export const bossEmoji: Record<BossName, string> = {
  Марли: "🏴‍☠️",
  Морф: "⚓",
  Кириос: "🧛",
};

export function getRespawnStart(lastKill: string, respawnHours: number): Date {
  return new Date(new Date(lastKill).getTime() + respawnHours * 60 * 60 * 1000);
}

export type MaintenanceWindow = { startAt: string; endAt: string };

function findAdHocWindow(
  now: Date,
  windows: MaintenanceWindow[],
): MaintenanceWindow | null {
  return (
    windows.find((w) => {
      const start = new Date(w.startAt).getTime();
      const end = new Date(w.endAt).getTime();
      const t = now.getTime();
      return t >= start && t < end;
    }) ?? null
  );
}

function isThursdayMsk(date: Date): boolean {
  return (
    date.toLocaleString("en-US", {
      timeZone: "Europe/Moscow",
      weekday: "short",
    }) === "Thu"
  );
}

// Границы окна 05:00-11:00 МСК для календарного дня (по МСК), на который
// приходится `date` — не проверяет день недели и не проверяет попадание
// внутрь этих часов, этим занимаются вызывающие функции.
function getRecurringWindowBoundsForDay(date: Date): {
  start: Date;
  end: Date;
} {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Moscow",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)!.value;
  const dateStr = `${get("year")}-${get("month")}-${get("day")}`;

  // Europe/Moscow — фиксированный UTC+3 без перехода на летнее время с 2014 года
  return {
    start: new Date(`${dateStr}T05:00:00+03:00`),
    end: new Date(`${dateStr}T11:00:00+03:00`),
  };
}

// Регулярное окно, которое реально накрывает `date` (день — четверг по МСК,
// и время внутри 05:00-11:00) — в отличие от
// getTodayRecurringMaintenanceWindow, которая сообщает границы окна для
// сегодняшнего дня, если сегодня четверг, независимо от текущего часа.
function getRecurringMaintenanceWindow(
  date: Date,
): { start: Date; end: Date } | null {
  if (!isThursdayMsk(date)) return null;
  const { start, end } = getRecurringWindowBoundsForDay(date);
  if (date < start || date >= end) return null;
  return { start, end };
}

// Каждый четверг 05:00-11:00 (МСК) на серверах проводятся профилактические работы,
// плюс единоразовые внеплановые окна, добавленные админом на странице настроек
export function isMaintenanceWindow(
  now: Date = new Date(),
  adHocWindows: MaintenanceWindow[] = [],
): boolean {
  if (findAdHocWindow(now, adHocWindows)) return true;
  return getRecurringMaintenanceWindow(now) !== null;
}

// Границы сегодняшнего регулярного окна (если сегодня четверг по МСК) —
// используется в настройках, чтобы предложить админу "продлить" плановые
// работы, добавив внеплановое окно сразу после штатного конца в 11:00
export function getTodayRecurringMaintenanceWindow(
  now: Date = new Date(),
): { start: Date; end: Date } | null {
  if (!isThursdayMsk(now)) return null;
  return getRecurringWindowBoundsForDay(now);
}

// То же самое, но для дня, наступающего через daysFromNow календарных дней
// (0 = сегодня) — используется, чтобы собрать регулярные окна на неделю
// вперёд для "Предстоящих мероприятий". Границы строятся напрямую из
// фиксированного смещения +03:00, без "фейкового локального времени", —
// поэтому совпадают день-в-день с тем, что уже записано в БД при продлении
// окна через getTodayRecurringMaintenanceWindow (важно для склейки смежных
// окон без миллисекундных расхождений).
export function getRecurringMaintenanceWindowInDays(
  daysFromNow: number,
): { start: Date; end: Date } | null {
  const date = new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000);
  if (!isThursdayMsk(date)) return null;
  return getRecurringWindowBoundsForDay(date);
}

// Правда игры: если сервер уходит на проф. работы, пока таймер респавна
// ещё тикает и не досчитал до respawnStart, игра сама сбрасывает респавн —
// даже если момент "killTime + respawnHours" сам по себе не попадает в окно
// профилактики. После такого сброса точное время респауна недостоверно,
// пока кто-то не подтвердит новый килл/появление. А вот если профилактика
// стартует уже ПОСЛЕ respawnStart — босс к этому моменту уже реально
// появился в мире (окно в 1ч — это сколько он там стоит), и профилактика
// такой респавн не отменяет. Проверяет, началось ли хотя бы одно окно
// (плановое четверговое или внеплановое) строго после killTime и не позже
// boundary (respawnStart — момент, когда босс мог появиться).
export function maintenanceStartedDuring(
  killTime: Date,
  boundary: Date,
  adHocWindows: MaintenanceWindow[] = [],
): boolean {
  const adHocHit = adHocWindows.some((w) => {
    const start = new Date(w.startAt);
    return start > killTime && start <= boundary;
  });
  if (adHocHit) return true;

  // respawnHours ограничен ~12ч, так что между killTime и boundary может
  // попасть старт регулярного окна максимум на одном из двух ближайших
  // календарных дней (по МСК).
  for (const offsetDays of [0, 1]) {
    const day = new Date(killTime.getTime() + offsetDays * 24 * 60 * 60 * 1000);
    if (!isThursdayMsk(day)) continue;
    const { start } = getRecurringWindowBoundsForDay(day);
    if (start > killTime && start <= boundary) return true;
  }
  return false;
}
