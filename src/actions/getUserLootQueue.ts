"use server";

import sql from "@/shared/lib/db";
import { ROLL_BASED_QUEUE_ITEMS } from "@/utils/rollBasedQueueItems";

export type UserLootQueueEntry = {
  id: number;
  itemName: string;
  status: string | null;
  place: number;
  totalInQueue: number;
  createdAt: string | null;
  iconUrl: string | null;
  grade: number | null;
};

export async function getUserLootQueue(
  userId: number,
): Promise<UserLootQueueEntry[]> {
  try {
    return await sql<UserLootQueueEntry[]>`
      WITH ranked AS (
        SELECT
          lq.id,
          lq.user_id,
          lq.status,
          lq.created_at,
          it.name AS item_name,
          it.icon_url,
          it.grade,
          ROW_NUMBER() OVER (
            PARTITION BY lq.item_type_id
            ORDER BY
              CASE WHEN it.name = ANY(${ROLL_BASED_QUEUE_ITEMS})
                   THEN -COALESCE(lq.roll, -1) END,
              (lq.position IS NULL), lq.position, lq.created_at
          )::int AS place,
          COUNT(*) OVER (PARTITION BY lq.item_type_id)::int AS total_in_queue
        FROM loot_queue lq
        JOIN item_type it ON it.id = lq.item_type_id
      )
      SELECT
        r.id,
        r.item_name AS "itemName",
        r.status,
        r.place,
        r.total_in_queue AS "totalInQueue",
        r.created_at AS "createdAt",
        r.icon_url AS "iconUrl",
        r.grade
      FROM ranked r
      WHERE r.user_id = ${userId}
      ORDER BY r.item_name, r.place
    `;
  } catch (error) {
    console.error("Ошибка при получении очереди игрока:", error);
    return [];
  }
}
