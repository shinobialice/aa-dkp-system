import type { mergeDailyAttendance } from "@/utils/mergeAttendanceSeries";

export type DailyAttendance = ReturnType<typeof mergeDailyAttendance>;
export type MonthlyAttendance = { month: string; prime: number; agl: number }[];

export type Period = { year: number; month: number };

export const FIRST_YEAR = 2025;

export const MONTH_NAMES = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

const MONTH_GENITIVE = [
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

export const PRIME_COLOR = "oklch(0.627 0.194 149.214)";
export const AGL_COLOR = "oklch(0.623 0.214 259.815)";

export function shiftPeriod({ year, month }: Period, delta: number): Period {
  const index = year * 12 + month + delta;
  return { year: Math.floor(index / 12), month: index % 12 };
}

export function samePeriod(a: Period, b: Period) {
  return a.year === b.year && a.month === b.month;
}

export function periodLabel({ year, month }: Period) {
  return `${MONTH_NAMES[month]} ${year}`;
}

export function isoDate(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

export function dayLabel(date: string) {
  const [, month, day] = date.split("-").map(Number);
  return `${day} ${MONTH_GENITIVE[month - 1]}`;
}

export function daysInMonth({ year, month }: Period) {
  return new Date(year, month + 1, 0).getDate();
}

export function fillMonth(period: Period, data: DailyAttendance) {
  const byDate = new Map(data.map((d) => [d.date, d]));
  return Array.from({ length: daysInMonth(period) }, (_, i) => {
    const date = isoDate(period.year, period.month, i + 1);
    const row = byDate.get(date);
    return { date, day: i + 1, prime: row?.prime ?? 0, agl: row?.agl ?? 0 };
  });
}

export function isRaidDay(row: { prime: number; agl: number }) {
  return row.prime > 0 || row.agl > 0;
}

export function averagePercent(
  data: DailyAttendance,
  key: "prime" | "agl",
): number | null {
  const values = data.map((d) => d[key]).filter((v) => v > 0);
  if (values.length === 0) return null;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}
