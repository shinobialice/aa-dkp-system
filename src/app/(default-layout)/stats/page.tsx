import {
  getGuildAttendancePrime,
  getGuildAttendanceAgl,
  getGuildPrimeStatsByYear,
  getGuildAglStatsByYear,
  getBossIncomeByMonth,
  getRaidsByDay,
  getRosterComposition,
  getInventoryStock,
  getSealGradeStats,
  getClassArchetypeStats,
} from "@/actions/guildStats";
import {
  mergeDailyAttendance,
  mergeMonthlyAttendance,
} from "@/utils/mergeAttendanceSeries";
import StatsClient from "@/widgets/Stats/StatsClient";
import { getMoscowISOString } from "@/utils/getMoscowISOString";
import { shiftPeriod } from "@/widgets/Stats/statsModel";

export default async function StatsPage() {
  const today = getMoscowISOString(new Date()).slice(0, 10);
  const [year, month] = today.split("-").map(Number);
  const period = { year, month: month - 1 };
  const previous = shiftPeriod(period, -1);

  const [
    dailyPrime,
    dailyAgl,
    previousPrime,
    previousAgl,
    monthlyPrime,
    monthlyAgl,
    income,
    previousIncome,
    raids,
    rosterComposition,
    inventoryStock,
    sealGradeStats,
    classArchetypeStats,
  ] = await Promise.all([
    getGuildAttendancePrime(period),
    getGuildAttendanceAgl(period),
    getGuildAttendancePrime(previous),
    getGuildAttendanceAgl(previous),
    getGuildPrimeStatsByYear(year),
    getGuildAglStatsByYear(year),
    getBossIncomeByMonth(period.month + 1, year),
    getBossIncomeByMonth(previous.month + 1, previous.year),
    getRaidsByDay(today),
    getRosterComposition(),
    getInventoryStock(),
    getSealGradeStats(),
    getClassArchetypeStats(),
  ]);

  return (
    <StatsClient
      today={today}
      initialPeriod={period}
      initialMonth={{
        daily: mergeDailyAttendance(dailyPrime, dailyAgl),
        previousDaily: mergeDailyAttendance(previousPrime, previousAgl),
        income,
        previousIncome,
      }}
      initialMonthly={mergeMonthlyAttendance(monthlyPrime, monthlyAgl)}
      initialRaids={raids}
      rosterComposition={rosterComposition}
      classArchetypeStats={classArchetypeStats}
      sealGradeStats={sealGradeStats}
      inventoryStock={inventoryStock}
    />
  );
}
