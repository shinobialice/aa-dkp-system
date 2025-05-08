"use server";

import supabase from "@/lib/supabase";

export async function distributeLootItem({
  lootId,
  quantity,
  soldTo,
  soldToId,
  isFree,
  comment,
  price,
}: {
  lootId: number;
  quantity: number;
  soldTo: string;
  soldToId?: number;
  isFree: boolean;
  comment?: string;
  price?: number;
}) {
  // 1. Load loot with item type
  const { data: loot, error: lootError } = await supabase
    .from("loot")
    .select("*, item_type(*)")
    .eq("id", lootId)
    .maybeSingle();

  if (lootError || !loot || !loot.quantity || loot.quantity < quantity) {
    throw new Error("Недостаточно предметов для выдачи");
  }

  const remainingQuantity = loot.quantity - quantity;

  // 2. Update remaining loot quantity and status
  const { error: updateOriginalError } = await supabase
    .from("loot")
    .update({
      quantity: remainingQuantity,
      status: remainingQuantity === 0 ? "Продано" : "В наличии",
    })
    .eq("id", lootId);

  if (updateOriginalError) {
    console.error(updateOriginalError);
    throw new Error("Ошибка при обновлении остатка лута");
  }

  // 3. Insert new loot record for the distributed portion
  const { data: created, error: createError } = await supabase
    .from("loot")
    .insert([
      {
        item_type_id: loot.item_type_id,
        source: loot.source,
        acquired_at: loot.acquired_at ?? new Date().toISOString(),
        quantity,
        sold_to: soldTo,
        sold_to_user_id: soldToId,
        sold_at: new Date().toISOString(),
        comment,
        status: isFree ? "Выдано" : "Продано",
        price: isFree ? 0 : price ?? loot.item_type?.price ?? 0,
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .maybeSingle();

  if (createError || !created) {
    console.error(createError);
    throw new Error("Ошибка при создании новой записи лута");
  }

  // 5. Add to user inventory if applicable
  if (soldToId) {
    const { error: inventoryError } = await supabase
      .from("user_inventory")
      .insert([
        {
          user_id: soldToId,
          name: loot.item_type.name,
          type: isFree ? "Выдано" : "Куплено",
          created_at: new Date().toISOString(),
          quantity,
        },
      ]);

    if (inventoryError) {
      console.error(inventoryError);
      throw new Error("Ошибка при добавлении предмета в инвентарь");
    }
  }
}
