"use server";

import supabase from "@/shared/lib/supabaseAdmin";
import { getGuildStatus } from "./guildStatusSettings";

export const getBosses = async () => {
  const [{ data: bosses, error }, status] = await Promise.all([
    supabase
      .from("boss")
      .select("id, boss_name, category, dkp_points_freeshard, dkp_points_pvp"),
    getGuildStatus(),
  ]);

  if (error || !bosses) {
    console.error("Ошибка при получении списка боссов:", error);
    throw new Error("Не удалось загрузить боссов");
  }

  return bosses.map((b) => ({
    id: b.id,
    boss_name: b.boss_name,
    category: b.category,
    dkp_points:
      status.mode === "pvp" ? b.dkp_points_pvp : b.dkp_points_freeshard,
  }));
};
