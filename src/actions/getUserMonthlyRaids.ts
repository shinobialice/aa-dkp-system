"use server";
import supabase from "@/shared/lib/supabaseAdmin";
import type { Database } from "@/types/supabase";

type RaidRow = Database["public"]["Tables"]["raid"]["Row"];

type RaidWithRelations = RaidRow & {
  raid_boss: Array<{ boss: { boss_name: string } | null }>;
  raid_attendance: Array<{ user_id: number; is_late: boolean }>;
};

export type UserMonthlyRaid = {
  id: number;
  type: string | null;
  startDate: string | null;
  dkpSummary: number;
  isLate: boolean;
  bosses: string[];
};

export async function getUserMonthlyRaids(
  userId: number,
  year: number,
  month: number,
): Promise<UserMonthlyRaid[]> {
  const startDate = new Date(Date.UTC(year, month - 1, 1)).toISOString();
  const endDate = new Date(
    Date.UTC(month === 12 ? year + 1 : year, month % 12, 1),
  ).toISOString();

  const { data, error } = await supabase
    .from("raid")
    .select(
      `
      id,
      type,
      start_date,
      dkp_summary,
      raid_boss(boss(boss_name)),
      raid_attendance(user_id, is_late)
    `,
    )
    .gte("start_date", startDate)
    .lt("start_date", endDate)
    .order("start_date", { ascending: false });

  if (error || !data) {
    console.error("Ошибка при получении рейдов пользователя:", error);
    throw new Error("Не удалось загрузить рейды пользователя");
  }

  const raids = data as unknown as RaidWithRelations[];

  return raids
    .filter((raid) => raid.raid_attendance.some((a) => a.user_id === userId))
    .map((raid) => ({
      id: raid.id,
      type: raid.type,
      startDate: raid.start_date,
      dkpSummary: raid.dkp_summary ?? 0,
      isLate:
        raid.raid_attendance.find((a) => a.user_id === userId)?.is_late ??
        false,
      bosses: (raid.raid_boss ?? [])
        .map((rb) => rb.boss?.boss_name)
        .filter((n): n is string => Boolean(n)),
    }));
}
