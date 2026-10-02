import type {
  DB_GetKillCountDto,
  KillCount,
  KillCountHistoryData,
  KillCountWar,
} from "../types";

export type KillRow = KillCount | DB_GetKillCountDto;

export type SortKey = "kills" | "honor";

export const ALL_DAYS = "all";

const WEEKDAYS = ["вс", "пн", "вт", "ср", "чт", "пт", "сб"];
const MONTHS_GENITIVE = [
  "января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря",
];

export const kills = (row: KillRow) => row.endKills - row.startKills;
export const honor = (row: KillRow) => row.endHonor - row.startHonor;

export function sortRows(rows: KillRow[], key: SortKey) {
  const primary = key === "kills" ? kills : honor;
  const secondary = key === "kills" ? honor : kills;
  return [...rows].sort(
    (a, b) => primary(b) - primary(a) || secondary(b) - secondary(a),
  );
}

export function formatNumber(value: number) {
  return value.toLocaleString("ru-RU");
}

export function avatarSrc(userName: string, avatarUrl?: string | null) {
  return (
    avatarUrl ?? `https://api.dicebear.com/6.x/initials/svg?seed=${userName}`
  );
}

/** "2026-09-14..." → "YYYY-MM-DD" (ключ дня и slug страницы дня). */
export const dayKey = (iso: string) => iso.slice(0, 10);

/** "YYYY-MM-DD" → "14.09" */
export function shortDate(iso: string) {
  const [, month, day] = dayKey(iso).split("-");
  return `${day}.${month}`;
}

/** "YYYY-MM-DD" → "14 сентября" */
export function longDate(iso: string) {
  const [, month, day] = dayKey(iso).split("-").map(Number);
  return `${day} ${MONTHS_GENITIVE[month - 1]}`;
}

export function weekday(iso: string) {
  const [year, month, day] = dayKey(iso).split("-").map(Number);
  return WEEKDAYS[new Date(year, month - 1, day).getDay()];
}

export function warTitle(war: KillCountWar) {
  return war.opponentGuild ? `Вар против ${war.opponentGuild}` : "Вар";
}

export function daysTotal(days: KillCountHistoryData[]) {
  return days.reduce((sum, day) => sum + Number(day.totalKills), 0);
}
