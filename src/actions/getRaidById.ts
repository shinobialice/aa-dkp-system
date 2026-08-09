"use server";

import supabase from "@/shared/lib/supabaseAdmin";

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
        is_late,
        user(id, username, active, class)
      ),
      loot(
        id,
        status,
        source,
        quantity,
        price,
        sold_to,
        acquired_at,
        sold_at,
        itemType: item_type ( id, name, price )
      )
    `,
    )
    .eq("id", parseInt(id))
    .maybeSingle();

  if (error || !raid) {
    console.error("Ошибка при получении рейда:", error);
    throw new Error("Не удалось найти рейд");
  }

  return raid;
};
