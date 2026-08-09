"use server";

import supabase from "@/shared/lib/supabaseAdmin";

export const linkLootToRaid = async (lootIds: number[], raidId: number) => {
  if (lootIds.length === 0) return;

  const { error } = await supabase
    .from("loot")
    .update({ raid_id: raidId })
    .in("id", lootIds);

  if (error) {
    console.error("Ошибка при привязке лута к рейду:", error);
    throw new Error("Не удалось привязать лут к рейду");
  }
};
