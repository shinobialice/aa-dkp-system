"use server";

import sql from "@/shared/lib/db";
import type { BossRow } from "@/shared/lib/dbTypes";
import ensurePrivilieges from "./ensurePrivilieges";
import { revalidatePath } from "next/cache";

export type BossPointsRow = Pick<
  BossRow,
  "id" | "boss_name" | "category" | "dkp_points_freeshard" | "dkp_points_pvp"
>;

export async function getBossPointsForSettings(): Promise<BossPointsRow[]> {
  try {
    return await sql<BossPointsRow[]>`
      SELECT id, boss_name, category, dkp_points_freeshard, dkp_points_pvp
      FROM boss
      ORDER BY id ASC
    `;
  } catch (error) {
    console.error("Ошибка при получении очков боссов:", error);
    throw new Error("Не удалось загрузить очки боссов");
  }
}

export async function updateBossPoints(
  updates: { id: number; freeshard: number; pvp: number }[],
) {
  await ensurePrivilieges(["Администратор"]);

  for (const update of updates) {
    if (!isPointsValue(update.freeshard) || !isPointsValue(update.pvp)) {
      throw new Error(
        "Значения очков должны быть целыми неотрицательными числами",
      );
    }
  }

  try {
    await sql.begin(async (tx) => {
      for (const update of updates) {
        await tx`
          UPDATE boss
          SET dkp_points_freeshard = ${update.freeshard}, dkp_points_pvp = ${update.pvp}
          WHERE id = ${update.id}
        `;
      }
    });
  } catch (error) {
    console.error("Ошибка при сохранении очков боссов:", error);
    throw new Error("Не удалось сохранить очки боссов");
  }

  revalidatePath("/settings");
}

function isPointsValue(value: number) {
  return Number.isInteger(value) && value >= 0;
}
