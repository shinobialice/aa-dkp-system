"use server";

import { RAID_EDITOR_TAGS } from "@/server/raidLinks";
import sql from "@/shared/lib/db";
import { publishChanges } from "@/server/liveChanges";
import ensurePrivilieges from "./ensurePrivilieges";

export const linkLootToRaid = async (lootIds: number[], raidId: number) => {
  if (lootIds.length === 0) return;
  await ensurePrivilieges(RAID_EDITOR_TAGS);

  try {
    await sql`
      UPDATE loot SET raid_id = ${raidId} WHERE id = ANY(${lootIds})
    `;
  } catch (error) {
    console.error("Ошибка при привязке лута к рейду:", error);
    throw new Error("Не удалось привязать лут к рейду");
  }
  await publishChanges("loot");
};
