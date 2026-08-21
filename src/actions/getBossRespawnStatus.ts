"use server";

import sql from "@/shared/lib/db";

export async function getBossRespawnStatus(bossNames: string[]) {
  try {
    return await sql<any[]>`
      SELECT boss_name, last_kill, updated_at
      FROM boss_respawn
      WHERE boss_name = ANY(${bossNames})
    `;
  } catch (error) {
    console.error("Ошибка при получении статуса респавна боссов:", error);
    return [];
  }
}
