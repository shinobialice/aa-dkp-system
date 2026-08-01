import {
  getGuildAttendancePrime,
  getGuildAttendanceAgl,
  getGuildPrimeStatsByYear,
  getGuildAglStatsByYear,
  getBossIncomeByMonth,
  getRaidsByDay,
  getRosterComposition,
  getInventoryStock,
} from "@/actions/guildStats";
import {
  mergeDailyAttendance,
  mergeMonthlyAttendance,
} from "@/utils/mergeAttendanceSeries";
import StatsPageClient from "./StatsPageClient";

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
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = getMoscowTodayISO();

  const [
    dailyPrime,
    dailyAgl,
    monthlyPrime,
    monthlyAgl,
    bossIncome,
    raids,
    rosterComposition,
    inventoryStock,
  ] = await Promise.all([
    getGuildAttendancePrime({ year, month }),
    getGuildAttendanceAgl({ year, month }),
    getGuildPrimeStatsByYear(year),
    getGuildAglStatsByYear(year),
    getBossIncomeByMonth(month + 1, year),
    getRaidsByDay(today),
    getRosterComposition(),
    getInventoryStock(),
  ]);

  return (
    <StatsPageClient
      initialYear={year}
      initialMonth={month}
      initialDailyData={mergeDailyAttendance(dailyPrime, dailyAgl)}
      initialMonthlyData={mergeMonthlyAttendance(monthlyPrime, monthlyAgl)}
      initialBossIncomeData={bossIncome}
      initialRaidsDate={today}
      initialRaidsData={raids}
      initialRosterComposition={rosterComposition}
      initialInventoryStock={inventoryStock}
    />
  );
}
