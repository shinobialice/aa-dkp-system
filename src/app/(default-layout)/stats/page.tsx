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
import { shiftPeriod } from "@/widgets/Stats/statsModel";

function getMoscowTodayISO(): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Moscow",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const y = parts.find((p) => p.type === "year")!.value;
  const m = parts.find((p) => p.type === "month")!.value;
  const d = parts.find((p) => p.type === "day")!.value;
  return `${y}-${m}-${d}`;
}

export default async function StatsPage() {
  const today = getMoscowTodayISO();
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
