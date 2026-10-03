"use server";

import sql from "@/shared/lib/db";
import {
  type QueueQueryRow,
  mapQueueRow,
  sortQueue,
  type QueueEntry,
} from "@/widgets/Loot/LootBuy/lootBuyModel";

export const getLootQueueByItemName = async (
  itemName: string,
): Promise<QueueEntry[]> => {
  let rows: QueueQueryRow[];
  try {
    rows = await sql<QueueQueryRow[]>`
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
      WHERE it.name = ${itemName}
    `;
  } catch (error) {
    console.error("Ошибка при получении очереди на предмет:", error);
    return [];
  }

  return sortQueue(itemName, rows.map(mapQueueRow));
};
