"use server";

import sql from "@/shared/lib/db";
import type { BossRow } from "@/shared/lib/dbTypes";
import { getGuildStatus, getGuildModeAtDate } from "./guildStatusSettings";

export type Boss = Pick<
  BossRow,
  "id" | "boss_name" | "category" | "dkp_points"
>;

type BossPointsRow = Pick<
  BossRow,
  "id" | "boss_name" | "category" | "dkp_points_freeshard" | "dkp_points_pvp"
>;

// atDate — если передана дата (например, дата рейда), очки резолвятся по
// режиму, который действовал на неё, а не по текущему режиму гильдии. Нужно
// для рейдов, создаваемых/редактируемых задним числом после смены фришка/пвп.
export const getBosses = async (atDate?: Date | string): Promise<Boss[]> => {
  try {
    const [bosses, mode] = await Promise.all([
      sql<BossPointsRow[]>`
        SELECT id, boss_name, category, dkp_points_freeshard, dkp_points_pvp
        FROM boss
      `,
      atDate
        ? getGuildModeAtDate(atDate)
        : getGuildStatus().then((s) => s.mode),
    ]);

    return bosses.map((b) => ({
      id: b.id,
      boss_name: b.boss_name,
      category: b.category,
      dkp_points: mode === "pvp" ? b.dkp_points_pvp : b.dkp_points_freeshard,
    }));
  } catch (error) {
    console.error("Ошибка при получении списка боссов:", error);
    throw new Error("Не удалось загрузить боссов");
  }
};
