"use server";

import supabase from "@/shared/lib/supabaseAdmin";

export const removeFromLootQueue = async (lootQueueId: number) => {
  const { error } = await supabase
    .from("loot_queue")
    .delete()
    .eq("id", lootQueueId);

  if (error) {
    console.error("Ошибка при удалении из очереди:", error);
    throw new Error("Не удалось удалить запись из очереди");
  }
};
