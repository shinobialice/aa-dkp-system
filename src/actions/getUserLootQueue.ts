"use server";

import sql from "@/shared/lib/db";
import { ROLL_BASED_QUEUE_ITEMS } from "@/utils/rollBasedQueueItems";

export type UserLootQueueEntry = {
  id: number;
  itemName: string;
  status: string | null;
  place: number;
  totalInQueue: number;
  createdAt: string;
};

export async function getUserLootQueue(
  userId: number,
): Promise<UserLootQueueEntry[]> {
  let rows;
  try {
    rows = await sql<any[]>`
      WITH ranked AS (
        SELECT
          lq.id,
          lq.user_id,
          lq.item_type_id,
          lq.status,
          lq.created_at,
          it.name AS item_name,
          ROW_NUMBER() OVER (
            PARTITION BY lq.item_type_id
            ORDER BY
              CASE WHEN it.name = ANY(${ROLL_BASED_QUEUE_ITEMS})
                   THEN -COALESCE(lq.roll, -1) END,
              (lq.position IS NULL), lq.position, lq.created_at
          ) AS place,
          COUNT(*) OVER (PARTITION BY lq.item_type_id) AS total_in_queue
        FROM loot_queue lq
        JOIN item_type it ON it.id = lq.item_type_id
      )
      SELECT r.*
      FROM ranked r
      WHERE r.user_id = ${userId}
      ORDER BY r.item_name, r.place
    `;
  } catch (error) {
    console.error("Ошибка при получении очереди игрока:", error);
    return [];
  }

  return rows.map((r) => ({
    id: r.id,
    itemName: r.item_name,
    status: r.status,
    place: Number(r.place),
    totalInQueue: Number(r.total_in_queue),
    createdAt: r.created_at,
  }));
}
