"use server";

import sql from "@/shared/lib/db";

type Boss = {
  id: number;
  boss_name: string;
};

type Raid = {
  id: number;
  start_date: string;
  type: string;
  raid_boss: {
    boss: Boss;
  }[];
};

type ScheduleRow = {
  weekday: string;
  time: string;
  boss_name: string;
};

const WEEKDAY_NAMES = [
  "Воскресенье",
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
];

// По четвергам с 05:00 до 11:00 идут технические работы — активности по
// расписанию в это окно не проводятся и не считаются пропущенными.
const THURSDAY_MAINTENANCE_START = "05:00";
const THURSDAY_MAINTENANCE_END = "11:00";

// Эти боссы не входят в обязательный план и не проверяются на пропуски.
const EXCLUDED_BOSSES = new Set([
  "Летучий Дельфиец",
  "Осада замка",
  "Оборона Ифнира",
  "Великий луг",
  "Пепельные равнины",
]);

// Эти конкретные слоты (босс+время) есть в расписании и реально проводятся,
// но их обычно не фиксируют в рейдах — поэтому не считаем их пропусками.
const EXCLUDED_SLOTS = new Set(["АГЛ|19:20"]);

// Насколько по времени фактический рейд может отклоняться от слота в
// расписании и всё ещё засчитываться как его выполнение.
const MATCH_TOLERANCE_MINUTES = 90;

function toMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

// Сопоставляет фактические времена с требуемыми слотами по близости (а не
// по порядковому номеру) и возвращает слоты, для которых не нашлось пары —
// иначе более поздний фактический рейд мог "перекрыть" собой более ранний
// пропущенный слот просто по счётчику.
function findMissingTimes(
  requiredTimes: string[],
  actualTimes: string[],
): string[] {
  const claimed = new Array(requiredTimes.length).fill(false);

  for (const actual of actualTimes) {
    const actualMin = toMinutes(actual);
    let bestIdx = -1;
    let bestDiff = Infinity;
    for (let i = 0; i < requiredTimes.length; i++) {
      if (claimed[i]) continue;
      const diff = Math.abs(toMinutes(requiredTimes[i]) - actualMin);
      if (diff <= MATCH_TOLERANCE_MINUTES && diff < bestDiff) {
        bestDiff = diff;
        bestIdx = i;
      }
    }
    if (bestIdx !== -1) claimed[bestIdx] = true;
  }

  return requiredTimes.filter((_, i) => !claimed[i]);
}

export type MissingSlot = {
  date: string; // "DD.MM"
  time: string; // "HH:MM"
  bossName: string;
};

export type MissingActivities = {
  hasDeficit: boolean;
  missingSlots: MissingSlot[];
};

// Раиды хранятся как наивные локальные (МСК) строки без таймзоны, поэтому
// "сегодня" тоже считаем в МСК, а не в таймзоне сервера/браузера.
function getMoscowToday() {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  const msk = new Date(utc + 3 * 60 * 60 * 1000);
  return {
    year: msk.getFullYear(),
    month: msk.getMonth() + 1,
    day: msk.getDate(),
  };
}

// targetYear/targetMonth не заданы — берём текущий месяц по МСК. Для
// текущего месяца проверяем по сегодняшний день, для прошлых — целиком, для
// будущих отдаём пустой результат (расписания ещё не было).
export const getMissingActivitiesForMonth = async (
  targetYear?: number,
  targetMonth?: number,
): Promise<MissingActivities> => {
  const {
    year: currentYear,
    month: currentMonth,
    day: currentDay,
  } = getMoscowToday();

  const year = targetYear ?? currentYear;
  const month = targetMonth ?? currentMonth;

  const isCurrentMonth = year === currentYear && month === currentMonth;
  const isFutureMonth =
    year > currentYear || (year === currentYear && month > currentMonth);
  const lastDayOfMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const lastDay = isFutureMonth
    ? 0
    : isCurrentMonth
      ? currentDay
      : lastDayOfMonth;

  if (lastDay === 0) {
    return { hasDeficit: false, missingSlots: [] };
  }

  let raidRows, scheduleData, morphSuggestionRows;
  try {
    [raidRows, scheduleData, morphSuggestionRows] = await Promise.all([
      sql<any[]>`
        SELECT r.id, r.start_date, r.type, b.id AS boss_id, b.boss_name AS boss_name
        FROM raid r
        LEFT JOIN raid_boss rb ON rb.raid_id = r.id
        LEFT JOIN boss b ON b.id = rb.boss_id
      `,
      sql<any[]>`SELECT weekday, time, boss_name FROM week_schedule_event`,
      sql<any[]>`
        SELECT kill_time FROM boss_kill_raid_suggestions
        WHERE boss_name = 'Морф' AND status = 'pending'
      `,
    ]);
  } catch (error) {
    console.error("Ошибка при получении данных для проверки расписания:", error);
    throw new Error("Не удалось загрузить рейды");
  }

  // У Морфа нет фиксированного расписания — рейд нужен ровно тогда, когда
  // его реально убили. Источник "требуемых" времён — не week_schedule_event,
  // а отметки в трекере респавна ("Убит сейчас"/"Указано время", та же
  // таблица, что питает карточку "Создать рейд?"). Отклонённые (status
  // 'dismissed', нажали ✕ — "рейд не нужен") и уже одобренные (строка к
  // этому моменту удалена, а реальный рейд создан) сюда не попадают.
  const requiredMorphTimesByDate = new Map<string, string[]>();
  for (const row of morphSuggestionRows ?? []) {
    const date = new Date(row.kill_time);
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: "Europe/Moscow",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }).formatToParts(date);
    const get = (type: string) => parts.find((p) => p.type === type)!.value;
    const datePart = `${get("year")}-${get("month")}-${get("day")}`;
    const time = `${get("hour")}:${get("minute")}`;
    if (!requiredMorphTimesByDate.has(datePart))
      requiredMorphTimesByDate.set(datePart, []);
    requiredMorphTimesByDate.get(datePart)!.push(time);
  }

  // Группируем плоский результат join'а обратно по рейдам.
  const raidMap = new Map<number, Raid>();
  for (const row of raidRows) {
    let raid = raidMap.get(row.id);
    if (!raid) {
      raid = { id: row.id, start_date: row.start_date, type: row.type, raid_boss: [] };
      raidMap.set(row.id, raid);
    }
    if (row.boss_id) {
      raid.raid_boss.push({ boss: { id: row.boss_id, boss_name: row.boss_name } });
    }
  }

  const raids = Array.from(raidMap.values());
  const schedule = scheduleData as ScheduleRow[];

  const scheduleByWeekday = new Map<string, ScheduleRow[]>();
  for (const row of schedule) {
    if (!scheduleByWeekday.has(row.weekday))
      scheduleByWeekday.set(row.weekday, []);
    scheduleByWeekday.get(row.weekday)!.push(row);
  }

  // Фактические рейды за месяц: "дата|имя_босса" -> отсортированные времена.
  // Чистый фарм АГЛ и Кошка — несколько одинаковых слотов в день, именные
  // Прайм-боссы (в т.ч. Анталлон) — свой ключ на каждое имя.
  const actualByDateAndBoss = new Map<string, string[]>();

  const addActual = (datePart: string, bossKey: string, time: string) => {
    const key = `${datePart}|${bossKey}`;
    if (!actualByDateAndBoss.has(key)) actualByDateAndBoss.set(key, []);
    actualByDateAndBoss.get(key)!.push(time);
  };

  for (const raid of raids) {
    if (!raid.start_date) continue;
    const [datePart, timePart] = raid.start_date.split("T");
    const [y, m, d] = datePart.split("-").map(Number);
    if (y !== year || m !== month || d > lastDay) continue;

    const time = timePart.slice(0, 5);
    const bossNames = (raid.raid_boss ?? [])
      .flatMap((rb) => rb.boss || [])
      .map((b) => b.boss_name)
      .filter(Boolean);

    if (raid.type === "АГЛ") {
      if (bossNames.length === 0) {
        addActual(datePart, "АГЛ", time);
      } else {
        for (const name of bossNames) {
          if (name === "Кошка") addActual(datePart, "Кошка", time);
          else if (name === "Морф") addActual(datePart, "Морф", time);
          else if (name === "Марли Прок") continue; // нет в расписании
          else addActual(datePart, "АГЛ", time);
        }
      }
    } else if (raid.type === "Прайм") {
      for (const name of bossNames) {
        addActual(datePart, name, time);
      }
    }
  }

  for (const times of actualByDateAndBoss.values()) {
    times.sort();
  }

  const missingSlots: MissingSlot[] = [];

  for (let d = 1; d <= lastDay; d++) {
    const weekday =
      WEEKDAY_NAMES[new Date(Date.UTC(year, month - 1, d)).getUTCDay()];
    const daySchedule = scheduleByWeekday.get(weekday) || [];
    const datePart = `${year}-${String(month).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
    const dateLabel = `${String(d).padStart(2, "0")}.${String(month).padStart(2, "0")}`;

    const requiredByBoss = new Map<string, string[]>();
    for (const row of daySchedule) {
      if (EXCLUDED_BOSSES.has(row.boss_name)) continue;
      const time = row.time.slice(0, 5);
      if (EXCLUDED_SLOTS.has(`${row.boss_name}|${time}`)) continue;
      if (
        weekday === "Четверг" &&
        time >= THURSDAY_MAINTENANCE_START &&
        time < THURSDAY_MAINTENANCE_END
      ) {
        continue; // технические работы
      }
      if (!requiredByBoss.has(row.boss_name))
        requiredByBoss.set(row.boss_name, []);
      requiredByBoss.get(row.boss_name)!.push(time);
    }

    const requiredMorphTimes = requiredMorphTimesByDate.get(datePart);
    if (requiredMorphTimes?.length) {
      requiredByBoss.set("Морф", [
        ...(requiredByBoss.get("Морф") ?? []),
        ...requiredMorphTimes,
      ]);
    }

    for (const [bossName, requiredTimes] of requiredByBoss) {
      requiredTimes.sort();
      const actualTimes = (
        actualByDateAndBoss.get(`${datePart}|${bossName}`) || []
      ).slice();
      const missingTimes = findMissingTimes(requiredTimes, actualTimes);
      for (const time of missingTimes) {
        missingSlots.push({ date: dateLabel, time, bossName });
      }
    }
  }

  missingSlots.sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time));

  return { hasDeficit: missingSlots.length > 0, missingSlots };
};
