"use server";

import sql from "@/shared/lib/db";
import type { RaidRow } from "@/shared/lib/dbTypes";
import ensurePrivilieges from "./ensurePrivilieges";
import { deleteRaidLinks, RAID_EDITOR_TAGS } from "@/server/raidLinks";
import { triggerFinanceRecalc } from "@/server/finance/recalc";
import { publishChanges } from "@/server/liveChanges";
import {
  getMoscowYearMonth,
  parseMoscowISOString,
} from "@/utils/getMoscowISOString";

export default async function deleteEvent(eventId: number) {
  await ensurePrivilieges(RAID_EDITOR_TAGS);

  const [raid] = await sql<Pick<RaidRow, "start_date">[]>`
    SELECT start_date FROM raid WHERE id = ${eventId}
  `;

  try {
    await sql.begin(async (tx) => {
      await deleteRaidLinks(tx, eventId);
      await tx`UPDATE loot SET raid_id = NULL WHERE raid_id = ${eventId}`;
      await tx`DELETE FROM raid WHERE id = ${eventId}`;
    });
  } catch (error) {
    console.error("Failed to delete raid:", error);
    throw new Error("Ошибка при удалении события");
  }
  await publishChanges("raids", "loot");

  if (raid?.start_date) {
    const { month, year } = getMoscowYearMonth(
      parseMoscowISOString(raid.start_date),
    );
    await triggerFinanceRecalc(month, year);
  }
}
