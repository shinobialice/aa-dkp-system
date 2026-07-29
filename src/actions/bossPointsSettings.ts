"use server";

import supabase from "@/shared/lib/supabaseAdmin";
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
  const { data, error } = await supabase
    .from("boss")
    .select("id, boss_name, category, dkp_points_freeshard, dkp_points_pvp")
    .order("id", { ascending: true });

  if (error || !data) {
    console.error("Ошибка при получении очков боссов:", error);
    throw new Error("Не удалось загрузить очки боссов");
  }

  return data;
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

  const results = await Promise.all(
    updates.map((u) =>
      supabase
        .from("boss")
        .update({
          dkp_points_freeshard: u.freeshard,
          dkp_points_pvp: u.pvp,
        })
        .eq("id", u.id),
    ),
  );

  const failed = results.find((r) => r.error);
  if (failed) {
    console.error("Ошибка при сохранении очков боссов:", failed.error);
    throw new Error("Не удалось сохранить очки боссов");
  }

  revalidatePath("/settings");
}
