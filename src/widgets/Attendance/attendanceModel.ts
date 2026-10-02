import type { CSSProperties } from "react";
import type { RangeRaid } from "@/actions/getRaidsInRange";

export type RaidKind = "prime" | "agl" | "koshka" | "morph" | "marli";
export type KindFilter = Record<RaidKind, boolean>;
export type AttendanceView = "week" | "month";

export const KINDS: { kind: RaidKind; label: string; dot: string }[] = [
  { kind: "prime", label: "Праймы", dot: "bg-red-600" },
  { kind: "agl", label: "АГЛ", dot: "bg-green-700" },
  { kind: "koshka", label: "Кошка", dot: "bg-pink-700" },
  { kind: "morph", label: "Морф", dot: "bg-blue-700" },
  { kind: "marli", label: "Марли Прок", dot: "bg-amber-800" },
];

const PRIME_COLORS: Record<string, { light: string; dark: string }> = {
  Кракен: { light: "#dc2626", dark: "#f87171" },
  Калидис: { light: "#7c3aed", dark: "#a78bfa" },
  Левиафан: { light: "#0e7490", dark: "#22d3ee" },
  Ксанатос: { light: "#c2410c", dark: "#fb923c" },
  Анталлон: { light: "#a16207", dark: "#facc15" },
  Корвус: { light: "#9333ea", dark: "#c084fc" },
  Калеиль: { light: "#0f766e", dark: "#2dd4bf" },
  Дельфиец: { light: "#2563eb", dark: "#60a5fa" },
  Осада: { light: "#18181b", dark: "#f4f4f5" },
};

const KIND_COLORS: Record<RaidKind, { light: string; dark: string }> = {
  prime: { light: "#b91c1c", dark: "#f87171" },
  agl: { light: "#15803d", dark: "#4ade80" },
  koshka: { light: "#be185d", dark: "#f472b6" },
  morph: { light: "#1d4ed8", dark: "#60a5fa" },
  marli: { light: "#92400e", dark: "#fbbf24" },
};

export function raidKind(raid: { type: string; bosses: string[] }): RaidKind {
  if (raid.type === "Прайм") return "prime";
  const names = raid.bosses.join(" ");
  if (names.includes("Кошка")) return "koshka";
  if (names.includes("Морф")) return "morph";
  if (names.includes("Марли")) return "marli";
  return "agl";
}

export function raidTitle(raid: { type: string; bosses: string[] }) {
  return raid.bosses.length ? raid.bosses.join(", ") : raid.type;
}

export function raidColorStyle(raid: {
  type: string;
  bosses: string[];
}): CSSProperties {
  const kind = raidKind(raid);
  const colors =
    (kind === "prime" && PRIME_COLORS[raid.bosses[0]]) || KIND_COLORS[kind];
  return {
    "--raid-color": colors.light,
    "--raid-color-dark": colors.dark,
  } as CSSProperties;
}

export const RAID_TEXT =
  "text-[var(--raid-color)] dark:text-[var(--raid-color-dark)]";
export const RAID_BG =
  "bg-[var(--raid-color)] dark:bg-[var(--raid-color-dark)]";

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
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return `${n} рейд`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return `${n} рейда`;
  }
  return `${n} рейдов`;
}

export function bossColorStyle(bossName: string, category: string) {
  return raidColorStyle({ type: category, bosses: [bossName] });
}
