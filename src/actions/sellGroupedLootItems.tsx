"use server";

import supabase from "@/lib/supabase";

export async function sellGroupedLootItems({
  itemTypeId,
  status,
  quantity,
  soldToId,
  isFree,
}: {
  itemTypeId: number;
  status: string;
  quantity: number;
  soldTo: string;
  soldToId?: number;
  isFree: boolean;
  comment?: string;
  price?: number;
}) {
  let left = quantity;

  // 1. Fetch loot with itemType
  const { data: items, error: fetchError } = await supabase
    .from("loot")
    .select("*, item_type(name)")
    .eq("item_type_id", itemTypeId)
    .eq("status", status)
    .order("acquired_at", { ascending: true });

  if (fetchError || !items) {
    console.error("Ошибка при получении лута:", fetchError);
    throw new Error("Не удалось загрузить предметы");
  }

  const totalAvailable = items.reduce((sum, i) => sum + (i.quantity ?? 1), 0);
  if (totalAvailable < quantity) {
    throw new Error("Недостаточно предметов для продажи");
  }

  for (const item of items) {
    const availableQty = item.quantity ?? 1;
    const takeQty = Math.min(left, availableQty);

    // 2. Update or delete the source loot entry
    if (takeQty === availableQty) {
      const { error: deleteError } = await supabase
        .from("loot")
        .delete()
        .eq("id", item.id);

      if (deleteError) {
        throw new Error("Ошибка при удалении лута");
      }
    } else {
      const { error: updateError } = await supabase
        .from("loot")
        .update({ quantity: availableQty - takeQty })
        .eq("id", item.id);

      if (updateError) {
        throw new Error("Ошибка при обновлении количества лута");
      }
    }

    // 3. Add to user inventory
    if (soldToId) {
      const { error: insertError } = await supabase
        .from("user_inventory")
        .insert([
          {
            user_id: soldToId,
            name: item.item_type.name,
            type: isFree ? "Выдано" : "Куплено",
            quantity: takeQty,
            created_at: new Date().toISOString(),
          },
        ]);

      if (insertError) {
        throw new Error("Ошибка при добавлении в инвентарь");
      }
    }

    left -= takeQty;
    if (left <= 0) break;
  }
}
