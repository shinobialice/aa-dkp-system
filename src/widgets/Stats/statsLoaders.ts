import {
  getBossIncomeByMonth,
  getGuildAttendanceAgl,
  getGuildAttendancePrime,
} from "@/actions/guildStats";
import { mergeDailyAttendance } from "@/utils/mergeAttendanceSeries";
import {
  fillMonth,
  isRaidDay,
  shiftPeriod,
  type DailyAttendance,
  type Period,
} from "./statsModel";
import { type MonthStats } from "./StatsClient";

async function loadDaily({ year, month }: Period) {
  const [prime, agl] = await Promise.all([
    getGuildAttendancePrime({ year, month }),
    getGuildAttendanceAgl({ year, month }),
  ]);
  return mergeDailyAttendance(prime, agl);
}

export async function loadMonth(period: Period): Promise<MonthStats> {
  const previous = shiftPeriod(period, -1);
  const [daily, previousDaily, income, previousIncome] = await Promise.all([
    loadDaily(period),
    loadDaily(previous),
    getBossIncomeByMonth(period.month + 1, period.year),
    getBossIncomeByMonth(previous.month + 1, previous.year),
  ]);
  return { daily, previousDaily, income, previousIncome };
}

export function defaultDate(
  period: Period,
  today: string,
  daily: DailyAttendance,
) {
  const days = fillMonth(period, daily);
  if (days.some((d) => d.date === today)) return today;
  return [...days].reverse().find(isRaidDay)?.date ?? days[0]?.date ?? null;
}
