"use server";

import sql from "@/shared/lib/db";
import {
  mapQueueRow,
  sortQueue,
  type QueueMap,
} from "@/widgets/Loot/LootBuy/lootBuyModel";

export const getAllLootQueues = async (): Promise<QueueMap> => {
  let rows;
  try {
    rows = await sql<any[]>`
      SELECT
        lq.id,
        lq.user_id,
        lq.status,
        lq.synth_target,
        lq.required,
        lq.delivered,
        lq.created_at,
        lq.roll,
        lq.position,
        it.name AS item_name,
        u.username,
        u.avatar_url,
        u.class
      FROM loot_queue lq
      JOIN item_type it ON it.id = lq.item_type_id
      LEFT JOIN "user" u ON u.id = lq.user_id
    `;
  } catch (error) {
    console.error("Ошибка при получении очередей на лут:", error);
    return {};
  }

  const grouped: QueueMap = {};
  for (const row of rows) {
    (grouped[row.item_name] ??= []).push(mapQueueRow(row));
  }
  for (const name of Object.keys(grouped)) {
    grouped[name] = sortQueue(name, grouped[name]);
  }
  return grouped;
};
