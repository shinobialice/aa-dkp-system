"use server";

import supabase from "@/lib/supabase";

export const markQueueLootAsSold = async ({
  lootQueueId,
  userId,
  itemName,
  delivered,
}: {
  lootQueueId: number;
  userId: number;
  itemName: string;
  delivered: number;
}) => {
  // 1. Delete the loot queue entry
  const { error: deleteError } = await supabase
    .from("loot_queue")
    .delete()
    .eq("id", lootQueueId);

  if (deleteError) {
    console.error("Ошибка при удалении из очереди:", deleteError);
    throw new Error("Не удалось удалить запись из очереди");
  }

  // 2. Create a new inventory entry
  const { data, error: insertError } = await supabase
    .from("user_inventory")
    .insert([
      {
        user_id: userId,
        name: itemName,
        type: "Куплено",
        quantity: delivered > 0 ? delivered : 1,
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .maybeSingle();

  if (insertError || !data) {
    console.error("Ошибка при добавлении в инвентарь:", insertError);
    throw new Error("Не удалось добавить предмет в инвентарь");
  }

  return data;
};
