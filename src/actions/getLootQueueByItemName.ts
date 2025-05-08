"use server";

import supabase from "@/lib/supabase";

export const getLootQueueByItemName = async (itemName: string) => {
  // Step 1: get item by name
  const { data: item, error: itemError } = await supabase
    .from("item_type")
    .select("id")
    .eq("name", itemName)
    .maybeSingle();

  if (itemError || !item) {
    console.error("Item not found or error:", itemError);
    return [];
  }

  // Step 2: get loot queue entries for this item with user info
  const { data: queue, error: queueError } = await supabase
    .from("loot_queue")
    .select(
      "id, user_id, status, synth_target, required, delivered, created_at, user(username)"
    )
    .eq("item_type_id", item.id)
    .order("created_at", { ascending: true });

  if (queueError || !queue) {
    console.error("Queue load error:", queueError);
    return [];
  }

  return queue.map((entry) => ({
    id: entry.id,
    userId: entry.user_id,
    username: entry.user?.username,
    status: entry.status,
    synth_target: entry.synth_target,
    required: entry.required ?? 0,
    delivered: entry.delivered ?? 0,
    createdAt: entry.created_at,
  }));
};
