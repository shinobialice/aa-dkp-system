"use server";

import sql from "@/shared/lib/db";

export async function getBossRespawnHistoryPage(page: number, pageSize: number) {
  try {
    const [{ count }] = await sql<any[]>`
      SELECT count(*)::int AS count FROM boss_respawn_history
    `;
    const rows = await sql<any[]>`
      SELECT id, boss_name, action, kill_time, prev_kill_time, next_respawn, user_id, created_at
      FROM boss_respawn_history
      ORDER BY id DESC
      LIMIT ${pageSize} OFFSET ${(page - 1) * pageSize}
    `;
    return { rows, total: count as number };
  } catch (error) {
    console.error("Ошибка при получении истории убийств боссов:", error);
    return { rows: [], total: 0 };
  }
}
