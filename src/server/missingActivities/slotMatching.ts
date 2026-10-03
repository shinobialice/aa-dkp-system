import type { ScheduleRow } from ".";

export const WEEKDAY_NAMES = [
  "Воскресенье",
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
];

const THURSDAY_MAINTENANCE_START = "05:00";
const THURSDAY_MAINTENANCE_END = "11:00";

const EXCLUDED_BOSSES = new Set([
  "Летучий Дельфиец",
  "Осада замка",
  "Оборона Ифнира",
  "Великий луг",
  "Пепельные равнины",
]);

// Слоты есть в расписании и проводятся, но в рейдах их обычно не фиксируют.
const EXCLUDED_SLOTS = new Set(["АГЛ|19:20"]);

const MATCH_TOLERANCE_MINUTES = 90;

export function requiredTimesByBoss(
  daySchedule: ScheduleRow[],
  weekday: string,
) {
  const required = new Map<string, string[]>();
  for (const row of daySchedule) {
    const time = row.time.slice(0, 5);
    if (isExcludedSlot(row.boss_name, time, weekday)) continue;
    pushTo(required, row.boss_name, time);
  }
  return required;
}

function isExcludedSlot(bossName: string, time: string, weekday: string) {
  if (EXCLUDED_BOSSES.has(bossName)) return true;
  if (EXCLUDED_SLOTS.has(`${bossName}|${time}`)) return true;
  return (
    weekday === "Четверг" &&
    time >= THURSDAY_MAINTENANCE_START &&
    time < THURSDAY_MAINTENANCE_END
  );
}

// Пары подбираются по близости времени, а не по счётчику, иначе поздний рейд
// мог бы закрыть собой пропущенный ранний слот.
export function findMissingTimes(
  requiredTimes: string[],
  actualTimes: string[],
) {
  const claimed = requiredTimes.map(() => false);

  for (const actual of actualTimes) {
    const actualMinutes = toMinutes(actual);
    let bestIndex = -1;
    let bestDiff = Infinity;
    for (const [index, required] of requiredTimes.entries()) {
      if (claimed[index]) continue;
      const diff = Math.abs(toMinutes(required) - actualMinutes);
      if (diff <= MATCH_TOLERANCE_MINUTES && diff < bestDiff) {
        bestDiff = diff;
        bestIndex = index;
      }
    }
    if (bestIndex !== -1) claimed[bestIndex] = true;
  }

  return requiredTimes.filter((_, index) => !claimed[index]);
}

function toMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

export function toDateLabel(datePart: string) {
  const [, month, day] = datePart.split("-");
  return `${day}.${month}`;
}

export function pad(value: number) {
  return String(value).padStart(2, "0");
}

export function pushTo<T>(map: Map<string, T[]>, key: string, value: T) {
  const list = map.get(key);
  if (list) list.push(value);
  else map.set(key, [value]);
}

export function groupBy<T>(items: T[], keyOf: (item: T) => string) {
  const map = new Map<string, T[]>();
  for (const item of items) pushTo(map, keyOf(item), item);
  return map;
}
