"use server";

import sql from "@/shared/lib/db";

export const linkLootToRaid = async (lootIds: number[], raidId: number) => {
  if (lootIds.length === 0) return;

  try {
    await sql<any[]>`
      UPDATE loot SET raid_id = ${raidId} WHERE id = ANY(${lootIds})
    `;
  } catch (error) {
    console.error("Ошибка при привязке лута к рейду:", error);
    throw new Error("Не удалось привязать лут к рейду");
  }
};
