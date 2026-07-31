import {
  getGuildAttendancePrime,
  getGuildAttendanceAgl,
  getGuildPrimeStatsByYear,
  getGuildAglStatsByYear,
  getBossIncomeByMonth,
} from "@/actions/guildStats";
import {
  mergeDailyAttendance,
  mergeMonthlyAttendance,
} from "@/utils/mergeAttendanceSeries";
import StatsPageClient from "./StatsPageClient";

export default async function StatsPage() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const [dailyPrime, dailyAgl, monthlyPrime, monthlyAgl, bossIncome] =
    await Promise.all([
      getGuildAttendancePrime({ year, month }),
      getGuildAttendanceAgl({ year, month }),
      getGuildPrimeStatsByYear(year),
      getGuildAglStatsByYear(year),
      getBossIncomeByMonth(month + 1, year),
    ]);

  return (
    <StatsPageClient
      initialYear={year}
      initialMonth={month}
      initialDailyData={mergeDailyAttendance(dailyPrime, dailyAgl)}
      initialMonthlyData={mergeMonthlyAttendance(monthlyPrime, monthlyAgl)}
      initialBossIncomeData={bossIncome}
    />
  );
}
