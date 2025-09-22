"use server";

import supabase from "@/lib/supabase";

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

  return (item.loot_queue || []).map((entry: any) => ({
    id: entry.id,
    userId: entry.user_id,
    username: entry.user?.username || "Unknown",
    status: entry.status,
    synth_target: entry.synth_target,
    required: entry.required ?? 0,
    delivered: entry.delivered ?? 0,
    createdAt: entry.created_at,
  }));
};
