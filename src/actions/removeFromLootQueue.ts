"use server";

import sql from "@/shared/lib/db";

export const removeFromLootQueue = async (lootQueueId: number) => {
  try {
    await sql<any[]>`
      DELETE FROM loot_queue WHERE id = ${lootQueueId}
    `;
  } catch (error) {
    console.error("Ошибка при удалении из очереди:", error);
    throw new Error("Не удалось удалить запись из очереди");
  }
};
