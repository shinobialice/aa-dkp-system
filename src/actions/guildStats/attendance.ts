"use server";

import supabase from "@/shared/lib/supabaseAdmin";

// raid.start_date хранится как naive-строка без таймзоны (мск. время без
// смещения, см. createRaidEvent.ts). Границы месяца/года строим той же
// naive-арифметикой по числам, без Date.UTC()/toISOString() — те применили
// бы к наивной строке смещение часового пояса и сдвинули бы границу.
function monthRangeBounds(year: number, month?: number) {
  const startMonthIndex = year * 12 + (month ?? 0);
  const endMonthIndex = month === undefined ? (year + 1) * 12 : startMonthIndex + 1;

  const toDateString = (monthIndex: number) => {
    const y = Math.floor(monthIndex / 12);
    const m = monthIndex % 12;
    return `${y}-${String(m + 1).padStart(2, "0")}-01T00:00:00`;
  };

  return { start: toDateString(startMonthIndex), end: toDateString(endMonthIndex) };
}

export async function getRaidData(year: number, month?: number) {
  const { start, end } = monthRangeBounds(year, month);

  const { data: raids, error } = await supabase
    .from("raid")
    .select("id, start_date, type, active_user_count")
    .gte("start_date", start)
    .lt("start_date", end);

  if (error || !raids) throw new Error("Ошибка при загрузке рейдов");

  return raids;
}

export async function getAttendances(raidIds?: number[]) {
  let query = supabase.from("raid_attendance").select("user_id, raid_id");
  if (raidIds) {
    if (raidIds.length === 0) return [];
    query = query.in("raid_id", raidIds);
  }

  const { data: attendances, error } = await query;

  if (error || !attendances)
    throw new Error("Ошибка при загрузке посещаемости");

  return attendances;
}

export async function calculateDailyAverage(
  raids: { id: number; start_date: string; active_user_count: number | null }[],
  attendances: { user_id: number; raid_id: number }[],
) {
  const raidMap = new Map<number, string>();
  const dailyMap = new Map<string, Set<number>>();
  const activeUsersPerDate = new Map<string, number>();

  for (const raid of raids) {
    if (!raid.start_date) continue;
    const date = raid.start_date.split("T")[0];
    raidMap.set(raid.id, date);
    activeUsersPerDate.set(date, raid.active_user_count ?? 0);
    if (!dailyMap.has(date)) dailyMap.set(date, new Set());
  }

  for (const att of attendances) {
    const date = raidMap.get(att.raid_id);
    if (!date) continue;
    dailyMap.get(date)?.add(att.user_id);
  }

  const daily = Array.from(dailyMap.entries()).map(([date, users]) => {
    const activeUsers = activeUsersPerDate.get(date) ?? 0;
    const percent = activeUsers > 0 ? (users.size / activeUsers) * 100 : 0;
    return { date, value: percent };
  });

  const avgPercent =
    daily.reduce((acc, d) => acc + d.value, 0) / (daily.length || 1);

  return { percent: avgPercent, daily };
}
