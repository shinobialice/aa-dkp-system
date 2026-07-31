"use server";

import supabase from "@/shared/lib/supabaseAdmin";

export const getLootQueueByItemName = async (itemName: string) => {
  const { data: item, error: itemError } = await supabase
    .from("item_type")
    .select(
      `
        id,
        loot_queue (
          id,
          user_id,
          status,
          synth_target,
          required,
          delivered,
          created_at,
          roll,
          user (
            username
          )
        )
      `,
    )
    .eq("name", itemName)
    .single();

  if (itemError || !item) {
    console.error(itemError);
    return [];
  }

  type LootQueueEntry = {
    id: number;
    user_id: number;
    status: string;
    synth_target: string | null;
    required: number | null;
    delivered: number | null;
    created_at: string;
    roll: number | null;
    user: { username: string } | null;
  };

  const lootQueue = (item.loot_queue || []) as unknown as LootQueueEntry[];

  return lootQueue.map((entry) => ({
    id: entry.id,
    userId: entry.user_id,
    username: entry.user?.username || "Unknown",
    status: entry.status,
    synth_target: entry.synth_target,
    required: entry.required ?? 0,
    delivered: entry.delivered ?? 0,
    createdAt: entry.created_at,
    roll: entry.roll,
  }));
};
