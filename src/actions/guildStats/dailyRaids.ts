"use server";

import supabase from "@/shared/lib/supabaseAdmin";

export type DailyRaidStat = {
  id: number;
  start_date: string;
  type: string;
  bosses: string[];
  attendeeCount: number;
  activeUserCount: number | null;
};

type Boss = { id: number; boss_name: string };
type RaidRow = {
  id: number;
  start_date: string;
  type: string;
  active_user_count: number | null;
  raid_boss: { boss: Boss[] }[];
  raid_attendance: { id: number }[];
};

function nextDayString(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  const next = new Date(Date.UTC(y, m - 1, d + 1));
  const yy = next.getUTCFullYear();
  const mm = String(next.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(next.getUTCDate()).padStart(2, "0");
  return `${yy}-${mm}-${dd}`;
}

// date — "YYYY-MM-DD". raid.start_date хранится как naive-строка без
// таймзоны (по факту московское время), поэтому границы дня строим так же,
// наивно, без прогона через toISOString().
export async function getRaidsByDay(date: string): Promise<DailyRaidStat[]> {
  const dayStart = `${date}T00:00:00`;
  const dayEnd = `${nextDayString(date)}T00:00:00`;

  const { data, error } = await supabase
    .from("raid")
    .select(
      `
      id,
      start_date,
      type,
      active_user_count,
      raid_boss(boss:boss_id(id, boss_name)),
      raid_attendance(id)
    `,
    )
    .gte("start_date", dayStart)
    .lt("start_date", dayEnd)
    .order("start_date", { ascending: true });

  if (error) {
    console.error("Ошибка при получении рейдов за день:", error);
    throw new Error("Не удалось загрузить рейды за день");
  }

  const raids = (data ?? []) as unknown as RaidRow[];

  return raids.map((raid) => ({
    id: raid.id,
    start_date: raid.start_date,
    type: raid.type,
    bosses:
      raid.raid_boss
        ?.flatMap((rb) => rb.boss || [])
        .map((b) => b.boss_name)
        .filter(Boolean) ?? [],
    attendeeCount: raid.raid_attendance?.length ?? 0,
    activeUserCount: raid.active_user_count,
  }));
}
