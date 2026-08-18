"use server";

import sql from "@/shared/lib/db";
import { getGuildStatus } from "./guildStatusSettings";

export const getBosses = async () => {
  let bosses, status;
  try {
    [bosses, status] = await Promise.all([
      sql<any[]>`
        SELECT id, boss_name, category, dkp_points_freeshard, dkp_points_pvp
        FROM boss
      `,
      getGuildStatus(),
    ]);
  } catch (error) {
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
