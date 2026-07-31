type DailySeries = { daily: { date: string; value: number }[] };

export function mergeDailyAttendance(prime: DailySeries, agl: DailySeries) {
  const raidsByDay: Record<string, { prime?: number; agl?: number }> = {};

  for (const day of prime.daily ?? []) {
    const key = day.date.split("T")[0];
    raidsByDay[key] = { ...raidsByDay[key], prime: day.value };
  }
  for (const day of agl.daily ?? []) {
    const key = day.date.split("T")[0];
    raidsByDay[key] = { ...raidsByDay[key], agl: day.value };
  }

  return Object.entries(raidsByDay)
    .map(([date, values]) => ({
      date,
      prime: values.prime ?? 0,
      agl: values.agl ?? 0,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

type MonthlySeries = { month: string; percent: number }[];

export function mergeMonthlyAttendance(prime: MonthlySeries, agl: MonthlySeries) {
  return prime.map((p, i) => ({
    month: p.month,
    prime: p.percent ?? 0,
    agl: agl[i]?.percent ?? 0,
  }));
}
