import type { GuildPeriod } from "@/actions/getGuildPeriods";
import { MONTH_NAMES_GENITIVE } from "@/shared/config/months";

export type PeriodSegment = {
  key: string;
  mode: GuildPeriod["mode"];
  label: string;
  title: string;
  left: number;
  width: number;
};

const MONTHS_IN_YEAR = 12;
const HOURS_IN_DAY = 24;

export function periodLabel(period: GuildPeriod) {
  if (period.mode === "freeshard") return "Фришка";
  if (period.opponents.length === 0) return "Вар";
  return `Вар: ${period.opponents.join(", ")}`;
}

export function periodSegments(
  periods: GuildPeriod[],
  year: number,
): PeriodSegment[] {
  return periods.flatMap((period) => {
    const start = monthPosition(period.startedAt, year);
    const end = monthPosition(period.endedAt, year);
    if (end <= start) return [];
    const label = periodLabel(period);
    const dates = period.isOngoing
      ? `с ${shortDate(period.startedAt)}`
      : `${shortDate(period.startedAt)} — ${shortDate(period.endedAt)}`;
    return [
      {
        key: period.startedAt,
        mode: period.mode,
        label,
        title: `${label}, ${dates}`,
        left: (start / MONTHS_IN_YEAR) * 100,
        width: ((end - start) / MONTHS_IN_YEAR) * 100,
      },
    ];
  });
}

export function monthPeriodsLabel(
  periods: GuildPeriod[],
  year: number,
  month: number,
) {
  return periods
    .filter((period) => {
      const start = monthPosition(period.startedAt, year);
      const end = monthPosition(period.endedAt, year);
      return start < month + 1 && end > month;
    })
    .map(periodLabel)
    .join(" → ");
}

function monthPosition(naive: string, year: number) {
  const [datePart, timePart = "00:00"] = naive.split("T");
  const [dateYear, dateMonth, day] = datePart.split("-").map(Number);
  if (dateYear < year) return 0;
  if (dateYear > year) return MONTHS_IN_YEAR;
  const hours = Number(timePart.slice(0, 2));
  const daysInMonth = new Date(Date.UTC(year, dateMonth, 0)).getUTCDate();
  const dayFraction = (day - 1 + hours / HOURS_IN_DAY) / daysInMonth;
  return dateMonth - 1 + dayFraction;
}

function shortDate(naive: string) {
  const [, month, day] = naive.slice(0, 10).split("-").map(Number);
  return `${day} ${MONTH_NAMES_GENITIVE[month - 1]}`;
}
