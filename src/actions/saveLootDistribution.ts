"use server";

import supabase from "@/shared/lib/supabase";

type LootItem = {
  name: string;
  date: string;
  comment?: string;
};

type Player = {
  id: number;
  loot: LootItem[];
};

export async function saveLootDistribution(players: Player[]) {
  for (const player of players) {
    // Step 1: check if user exists
    const { data: user, error: userError } = await supabase
      .from("user")
      .select("id")
      .eq("id", player.id)
      .maybeSingle();

    if (userError || !user) {
      console.warn(`User ${player.id} not found or error`, userError);
      continue;
    }

    for (const loot of player.loot) {
      if (!loot.date) continue;

      const itemName = loot.comment || loot.name;

      // Step 2: check if itemType exists
      const { data: itemType, error: itemError } = await supabase
        .from("item_type")
        .select("id")
        .eq("name", itemName)
        .maybeSingle();

      if (itemError || !itemType) {
        console.warn(`Item "${itemName}" not found or error`, itemError);
        continue;
      }

      // Step 3: delete old inventory entry
      const { error: deleteError } = await supabase
        .from("user_inventory")
        .delete()
        .eq("user_id", user.id)
        .eq("name", itemName);

      if (deleteError) {
        console.error("Ошибка при удалении старого инвентаря:", deleteError);
        continue;
      }

      // Step 4: insert new inventory entry
      const { error: insertError } = await supabase
        .from("user_inventory")
        .insert([
          {
            user_id: user.id,
            name: itemName,
            type: "Раздача лута",
            created_at: new Date(loot.date).toISOString(),
          },
        ]);

      if (insertError) {
        console.error("Ошибка при добавлении нового предмета:", insertError);
      }
    }
  }

  return { success: true };
}
