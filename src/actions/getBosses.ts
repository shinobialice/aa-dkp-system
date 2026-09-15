"use server";

import sql from "@/shared/lib/db";
import { getGuildStatus, getGuildModeAtDate } from "./guildStatusSettings";

// atDate — если передана дата (например, дата рейда), очки резолвятся по
// режиму, который действовал на неё, а не по текущему режиму гильдии. Нужно
// для рейдов, создаваемых/редактируемых задним числом после смены фришка/пвп.
export const getBosses = async (atDate?: Date | string) => {
  let bosses, mode;
  try {
    [bosses, mode] = await Promise.all([
      sql<any[]>`
        SELECT id, boss_name, category, dkp_points_freeshard, dkp_points_pvp
        FROM boss
      `,
      atDate ? getGuildModeAtDate(atDate) : getGuildStatus().then((s) => s.mode),
    ]);
  } catch (error) {
    console.error("Ошибка при получении списка боссов:", error);
    throw new Error("Не удалось загрузить боссов");
  }

  return bosses.map((b) => ({
    id: b.id,
    boss_name: b.boss_name,
    category: b.category,
    dkp_points: mode === "pvp" ? b.dkp_points_pvp : b.dkp_points_freeshard,
  }));
};
