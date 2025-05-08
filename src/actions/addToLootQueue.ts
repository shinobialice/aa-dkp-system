"use server";

import supabase from "@/lib/supabase";

export const addToLootQueue = async (username: string, itemName: string) => {
  // Fetch user by username
  const { data: users, error: userError } = await supabase
    .from("user")
    .select("id")
    .eq("username", username)
    .maybeSingle();

  if (userError || !users) {
    throw new Error("User not found");
  }

  // Fetch itemType by name
  const { data: item, error: itemError } = await supabase
    .from("item_type")
    .select("id")
    .eq("name", itemName)
    .maybeSingle();

  if (itemError || !item) {
    throw new Error("Item not found");
  }

  // Insert into loot_queue
  const { data: newEntry, error: insertError } = await supabase
    .from("loot_queue")
    .insert([
      {
        user_id: users.id,
        item_type_id: item.id,
        status: "ожидание",
        required: 1,
        delivered: 0,
        synth_target: "",
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .maybeSingle();

  if (insertError || !newEntry) {
    throw new Error("Failed to insert into loot queue");
  }

  return newEntry;
};
