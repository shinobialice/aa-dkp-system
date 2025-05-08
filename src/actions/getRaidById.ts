"use server";

import supabase from "@/lib/supabase";

export const getRaidById = async (id: string) => {
  const { data: raid, error } = await supabase
    .from("raid")
    .select(
      `
      *,
      raid_boss(
        boss(id, boss_name, dkp_points, category)
      ),
      raid_attendance(
        user(id, username, active, class)
      )
    `
    )
    .eq("id", parseInt(id))
    .maybeSingle();

  if (error || !raid) {
    console.error("Ошибка при получении рейда:", error);
    throw new Error("Не удалось найти рейд");
  }

  return raid;
};
