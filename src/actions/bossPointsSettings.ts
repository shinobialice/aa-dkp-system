"use server";

import sql from "@/shared/lib/db";
import ensurePrivilieges from "./ensurePrivilieges";
import { revalidatePath } from "next/cache";

export type BossPointsRow = {
  id: number;
  boss_name: string;
  category: string;
  dkp_points_freeshard: number;
  dkp_points_pvp: number;
};

export async function getBossPointsForSettings(): Promise<BossPointsRow[]> {
  try {
    const data = await sql<any[]>`
      SELECT id, boss_name, category, dkp_points_freeshard, dkp_points_pvp
      FROM boss
      ORDER BY id ASC
    `;
    return data;
  } catch (error) {
    console.error("Ошибка при получении очков боссов:", error);
    throw new Error("Не удалось загрузить очки боссов");
  }
}

export async function updateBossPoints(
  updates: { id: number; freeshard: number; pvp: number }[],
) {
  await ensurePrivilieges(["Администратор"]);

  for (const u of updates) {
    if (
      !Number.isInteger(u.freeshard) ||
      u.freeshard < 0 ||
      !Number.isInteger(u.pvp) ||
      u.pvp < 0
    ) {
      throw new Error(
        "Значения очков должны быть целыми неотрицательными числами",
      );
    }
  }

  try {
    await Promise.all(
      updates.map(
        (u) => sql<any[]>`
          UPDATE boss SET dkp_points_freeshard = ${u.freeshard}, dkp_points_pvp = ${u.pvp}
          WHERE id = ${u.id}
        `,
      ),
    );
  } catch (error) {
    console.error("Ошибка при сохранении очков боссов:", error);
    throw new Error("Не удалось сохранить очки боссов");
  }

  revalidatePath("/settings");
}
