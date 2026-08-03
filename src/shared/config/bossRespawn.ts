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

function isWithinAdHocWindow(now: Date, windows: MaintenanceWindow[]): boolean {
  return windows.some((w) => {
    const start = new Date(w.startAt).getTime();
    const end = new Date(w.endAt).getTime();
    const t = now.getTime();
    return t >= start && t < end;
  });
}

// Каждый четверг 05:00-11:00 (МСК) на серверах проводятся профилактические работы,
// плюс единоразовые внеплановые окна, добавленные админом на странице настроек
export function isMaintenanceWindow(
  now: Date = new Date(),
  adHocWindows: MaintenanceWindow[] = [],
): boolean {
  if (isWithinAdHocWindow(now, adHocWindows)) return true;

  const weekday = now.toLocaleString("en-US", {
    timeZone: "Europe/Moscow",
    weekday: "short",
  });
  const hour = Number(
    now.toLocaleString("en-US", {
      timeZone: "Europe/Moscow",
      hour: "2-digit",
      hour12: false,
    }),
  );
  return weekday === "Thu" && hour >= 5 && hour < 11;
}

// Границы сегодняшнего регулярного окна (если сегодня четверг по МСК) —
// используется в настройках, чтобы предложить админу "продлить" плановые
// работы, добавив внеплановое окно сразу после штатного конца в 11:00
export function getTodayRecurringMaintenanceWindow(
  now: Date = new Date(),
): { start: Date; end: Date } | null {
  const weekday = now.toLocaleString("en-US", {
    timeZone: "Europe/Moscow",
    weekday: "short",
  });
  if (weekday !== "Thu") return null;

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Moscow",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);
  const get = (type: string) => parts.find((p) => p.type === type)!.value;
  const dateStr = `${get("year")}-${get("month")}-${get("day")}`;

  // Europe/Moscow — фиксированный UTC+3 без перехода на летнее время с 2014 года
  return {
    start: new Date(`${dateStr}T05:00:00+03:00`),
    end: new Date(`${dateStr}T11:00:00+03:00`),
  };
}
