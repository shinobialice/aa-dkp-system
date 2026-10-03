"use server";

import sql from "@/shared/lib/db";
import type { BossRespawnHistoryRow } from "@/shared/lib/dbTypes";

export type RespawnHistoryEntry = Pick<
  BossRespawnHistoryRow,
  | "id"
  | "boss_name"
  | "action"
  | "kill_time"
  | "prev_kill_time"
  | "next_respawn"
  | "created_at"
> & { username: string | null };

export async function getBossRespawnHistoryPage(
  page: number,
  pageSize: number,
) {
  try {
    const [[{ count }], rows] = await Promise.all([
      sql<{ count: number }[]>`
        SELECT count(*)::int AS count FROM boss_respawn_history
      `,
      sql<RespawnHistoryEntry[]>`
        SELECT h.id, h.boss_name, h.action, h.kill_time, h.prev_kill_time,
               h.next_respawn, h.created_at, u.username
        FROM boss_respawn_history h
        LEFT JOIN "user" u ON u.id = h.user_id
        ORDER BY h.id DESC
        LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}
      `,
    ]);
    return { rows, total: count };
  } catch (error) {
    console.error("Ошибка при получении истории убийств боссов:", error);
    return { rows: [], total: 0 };
  }
}
