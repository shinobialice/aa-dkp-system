"use server";

import supabase from "@/lib/supabase";

export async function getRaidData(year: number, month?: number) {
  const { data: raids, error } = await supabase
    .from("raid")
    .select("id, start_date, type, active_user_count");

  if (error || !raids) throw new Error("Ошибка при загрузке рейдов");

  return raids.filter((r) => {
    if (!r.start_date) return false;
    const d = new Date(r.start_date);
    return (
      d.getFullYear() === year &&
      (month === undefined || d.getMonth() === month)
    );
  });
}

export async function getAttendances() {
  const { data: attendances, error } = await supabase
    .from("raid_attendance")
    .select("user_id, raid_id");

  if (error || !attendances)
    throw new Error("Ошибка при загрузке посещаемости");

  return attendances;
}

export async function calculateDailyAverage(
  raids: { id: number; start_date: string; active_user_count: number | null }[],
  attendances: { user_id: number; raid_id: number }[]
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
