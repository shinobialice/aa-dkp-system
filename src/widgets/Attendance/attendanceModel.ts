import type { RangeRaid } from "@/actions/getRaidsInRange";
import { plural } from "@/shared/lib/format";
import { raidKind, type RaidKind } from "./raidKinds";

export type KindFilter = Record<RaidKind, boolean>;
export type AttendanceView = "week" | "month";
export type RaidState = "empty" | "attended" | "missed";
export type DayTone = "full" | "part" | "none";

export const ALL_KINDS: KindFilter = {
  prime: true,
  agl: true,
  koshka: true,
  morph: true,
  marli: true,
};

const DAY_MS = 24 * 60 * 60 * 1000;
const MSK_OFFSET_MS = 3 * 60 * 60 * 1000;

export const WEEK_DAYS = [
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
  "Воскресенье",
];
export const SHORT_DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

export function moscowTodayKey(now = Date.now()) {
  return new Date(now + MSK_OFFSET_MS).toISOString().slice(0, 10);
}

export function keyToTime(key: string) {
  return Date.parse(`${key}T00:00:00Z`);
}

export function timeToKey(time: number) {
  return new Date(time).toISOString().slice(0, 10);
}

function mondayOf(time: number) {
  const weekday = (new Date(time).getUTCDay() + 6) % 7;
  return time - weekday * DAY_MS;
}

export type DateRange = { from: string; to: string; days: string[] };

export function weekRange(anchorKey: string): DateRange {
  const monday = mondayOf(keyToTime(anchorKey));
  const days = Array.from({ length: 7 }, (_, i) =>
    timeToKey(monday + i * DAY_MS),
  );
  return { from: days[0], to: timeToKey(monday + 7 * DAY_MS), days };
}

export function monthRange(anchorKey: string): DateRange {
  const anchor = new Date(keyToTime(anchorKey));
  const first = Date.UTC(anchor.getUTCFullYear(), anchor.getUTCMonth(), 1);
  const next = Date.UTC(anchor.getUTCFullYear(), anchor.getUTCMonth() + 1, 1);
  const start = mondayOf(first);
  const end = mondayOf(next - DAY_MS) + 7 * DAY_MS;
  const days: string[] = [];
  for (let t = start; t < end; t += DAY_MS) days.push(timeToKey(t));
  return { from: days[0], to: timeToKey(end), days };
}

export function shiftAnchor(
  anchorKey: string,
  view: AttendanceView,
  delta: number,
) {
  const time = keyToTime(anchorKey);
  if (view === "week") return timeToKey(time + delta * 7 * DAY_MS);
  const date = new Date(time);
  return timeToKey(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + delta, 1),
  );
}

export function sameMonth(a: string, b: string) {
  return a.slice(0, 7) === b.slice(0, 7);
}

export function formatDay(key: string, options: Intl.DateTimeFormatOptions) {
  return new Date(keyToTime(key))
    .toLocaleDateString("ru-RU", { ...options, timeZone: "UTC" })
    .replace(".", "");
}

export function rangeLabel(
  view: AttendanceView,
  range: DateRange,
  anchorKey: string,
) {
  if (view === "month") {
    const label = formatDay(anchorKey, { month: "long", year: "numeric" });
    return label.charAt(0).toUpperCase() + label.slice(1).replace(" г", "");
  }
  const first = range.days[0];
  const last = range.days[6];
  const end = formatDay(last, { day: "numeric", month: "long" });
  if (sameMonth(first, last)) {
    return `${formatDay(first, { day: "numeric" })} — ${end}`;
  }
  return `${formatDay(first, { day: "numeric", month: "long" })} — ${end}`;
}

export function filterRaids(
  raids: RangeRaid[],
  filter: KindFilter,
  attendedOnly: boolean,
) {
  return raids.filter(
    (raid) => filter[raidKind(raid)] && (!attendedOnly || raid.attended),
  );
}

export function raidsByDay(raids: RangeRaid[]) {
  const map = new Map<string, RangeRaid[]>();
  for (const raid of raids) {
    const key = raid.start.slice(0, 10);
    const list = map.get(key) ?? [];
    list.push(raid);
    map.set(key, list);
  }
  return map;
}

export type MyStats = {
  primes: { attended: number; total: number };
  others: { attended: number; total: number };
  missedPrimes: RangeRaid[];
};

export function myStats(raids: RangeRaid[], todayKey: string): MyStats {
  const done = raids.filter(
    (raid) => raid.people > 0 && raid.start.slice(0, 10) <= todayKey,
  );
  const primes = done.filter((raid) => raidKind(raid) === "prime");
  const others = done.filter((raid) => raidKind(raid) !== "prime");
  return {
    primes: {
      attended: primes.filter((raid) => raid.attended).length,
      total: primes.length,
    },
    others: {
      attended: others.filter((raid) => raid.attended).length,
      total: others.length,
    },
    missedPrimes: primes.filter((raid) => !raid.attended),
  };
}

export function percent(part: number, total: number) {
  return total ? Math.round((part / total) * 100) : 0;
}

export function raidsCount(n: number) {
  return `${n} ${plural(n, "рейд", "рейда", "рейдов")}`;
}

export function raidState(raid: RangeRaid): RaidState {
  if (raid.people === 0) return "empty";
  return raid.attended ? "attended" : "missed";
}

export function dayTone(attended: number, total: number): DayTone | null {
  if (total === 0) return null;
  if (attended === total) return "full";
  return attended > 0 ? "part" : "none";
}

export function selectedDayOf(
  days: string[],
  pickedDay: string | null,
  todayKey: string,
) {
  if (pickedDay && days.includes(pickedDay)) return pickedDay;
  if (days.includes(todayKey)) return todayKey;
  return days[0];
}
