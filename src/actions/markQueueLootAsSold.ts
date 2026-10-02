"use server";

import sql from "@/shared/lib/db";
import ensurePrivilieges from "./ensurePrivilieges";

export const markQueueLootAsSold = async (lootQueueId: number) => {
  await ensurePrivilieges(["Администратор"]);
  try {
    await sql<any[]>`DELETE FROM loot_queue WHERE id = ${lootQueueId}`;
  } catch (error) {
    console.error("Ошибка при удалении из очереди:", error);
    throw new Error("Не удалось удалить запись из очереди");
  }
};
