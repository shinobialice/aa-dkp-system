"use server";

import sql from "@/shared/lib/db";
import type { BossRespawnRow } from "@/shared/lib/dbTypes";

export type BossRespawnStatus = Pick<
  BossRespawnRow,
  "boss_name" | "last_kill" | "updated_at"
> & { marked_by: string | null };

export async function getBossRespawnStatus(bossNames: string[]) {
  try {
    return await sql<BossRespawnStatus[]>`
      SELECT br.boss_name, br.last_kill, br.updated_at, mark.username AS marked_by
      FROM boss_respawn br
      LEFT JOIN LATERAL (
        SELECT u.username
        FROM boss_respawn_history h
        JOIN "user" u ON u.id = h.user_id
        WHERE h.boss_name = br.boss_name
        ORDER BY h.id DESC
        LIMIT 1
      ) mark ON true
      WHERE br.boss_name = ANY(${bossNames})
    `;
  } catch (error) {
    console.error("Ошибка при получении статуса респавна боссов:", error);
    return [];
  }
}
