"use server";

import supabase from "@/lib/supabase";

export const markLootItemAsSold = async ({
  lootId,
  soldTo,
  soldToId,
  price,
  comment,
  quantity,
  isFree = false,
}: {
  lootId: number;
  soldTo: string;
  soldToId?: number;
  price: number;
  comment?: string;
  quantity: number;
  isFree?: boolean;
}) => {
  // Step 1: Get loot with itemType
  const { data: loot, error: lootError } = await supabase
    .from("loot")
    .select("*, item_type(name)")
    .eq("id", lootId)
    .maybeSingle();

  if (lootError || !loot) {
    throw new Error("Лут не найден");
  }

  if (quantity > loot.quantity) {
    throw new Error(
      `Нельзя продать ${quantity} шт — в наличии только ${loot.quantity}`,
    );
  }

  const remainingQuantity = loot.quantity - quantity;

  // Step 2: Update existing loot quantity/status
  const { error: updateError } = await supabase
    .from("loot")
    .update({
      quantity: remainingQuantity,
      status: remainingQuantity === 0 ? "Продано" : "В наличии",
    })
    .eq("id", lootId);

  if (updateError) {
    console.error(updateError);
    throw new Error("Ошибка при обновлении количества лута");
  }

  // Step 3: Create new loot sale entry
  const { error: createLootError } = await supabase.from("loot").insert([
    {
      item_type_id: loot.item_type_id,
      source: loot.source,
      acquired_at: new Date().toISOString(),
      quantity,
      status: isFree ? "Выдано" : "Продано",
      price: isFree ? 0 : price,
      sold_at: new Date().toISOString(),
      sold_to: soldTo,
      sold_to_user_id: soldToId ?? null,
      comment,
      created_at: new Date().toISOString(),
    },
  ]);

  if (createLootError) {
    console.error(createLootError);
    throw new Error("Ошибка при создании новой записи лута");
  }

  // Step 4: Add item to user's inventory
  if (soldToId) {
    const { error: inventoryError } = await supabase
      .from("user_inventory")
      .insert([
        {
          user_id: soldToId,
          name: loot.item_type.name,
          type: isFree ? "Выдано" : "Куплено",
          quantity,
          created_at: new Date().toISOString(),
        },
      ]);

    if (inventoryError) {
      console.error(inventoryError);
      throw new Error("Ошибка при добавлении предмета в инвентарь");
    }
  }
};
