"use server";

import supabase from "@/shared/lib/supabaseAdmin";
import { triggerFinanceRecalc } from "./recalculateFinanceForMonth";

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
  let newStatus = loot.status;

  if (remainingQuantity === 0) {
    if (loot.status === "В наличии" || loot.status === "Продаётся") {
      newStatus = "Распродано";
    }
  }

  await supabase
    .from("loot")
    .update({
      quantity: remainingQuantity,
      status: newStatus,
    })
    .eq("id", lootId);

  // 3. Insert new loot record for the distributed portion
  const soldAt = new Date().toISOString();
  const { data: created, error: createError } = await supabase
    .from("loot")
    .insert([
      {
        item_type_id: loot.item_type_id,
        source: loot.source,
        acquired_at: loot.acquired_at ?? soldAt,
        quantity,
        sold_to: soldTo,
        sold_to_user_id: soldToId,
        sold_at: soldAt,
        comment,
        status: isFree ? "Выдано" : "Продано",
        price: isFree ? 0 : (price ?? loot.item_type?.price ?? 0),
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .maybeSingle();

  if (createError || !created) {
    console.error(createError);
    throw new Error("Ошибка при создании новой записи лута");
  }

  if (!isFree) {
    const soldAtDate = new Date(soldAt);
    await triggerFinanceRecalc(soldAtDate.getMonth() + 1, soldAtDate.getFullYear());
  }

  // 5. Add to user inventory if applicable
  if (soldToId) {
    let skipInsert = false;

    if (isFree) {
      const { data: existingInventory, error: inventoryFindError } =
        await supabase
          .from("user_inventory")
          .select("id")
          .eq("user_id", soldToId)
          .eq("name", loot.item_type.name)
          .limit(1);

      if (inventoryFindError) {
        console.error(inventoryFindError);
        throw new Error("Не удалось проверить инвентарь");
      }

      skipInsert = (existingInventory?.length ?? 0) > 0;
    }

    if (!skipInsert) {
      const { error: inventoryError } = await supabase
        .from("user_inventory")
        .insert([
          {
            user_id: soldToId,
            name: loot.item_type.name,
            type: isFree ? "Выдано" : "Куплено",
            created_at: new Date().toISOString(),
            quantity,
            loot_id: created.id,
          },
        ]);

      if (inventoryError) {
        console.error(inventoryError);
        throw new Error("Ошибка при добавлении предмета в инвентарь");
      }
    }
  }
}

// Редактирование уже существующей продажи/выдачи. В отличие от
// distributeLootItem — это правит запись на месте, а не создаёт новую,
// чтобы не задваивать доход казны (generateGuildFunds считает по
// status = "Продано" без учёта quantity) и не плодить дубликаты в
// инвентаре покупателя. sold_at и acquired_at намеренно не трогаем —
// иначе редактирование в другом месяце задвоило бы доход между месяцами.
export async function updateLootSale({
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
  const { data: loot, error: lootError } = await supabase
    .from("loot")
    .select("*, item_type(*)")
    .eq("id", lootId)
    .maybeSingle();

  if (lootError || !loot) {
    throw new Error("Запись о продаже не найдена");
  }

  const newStatus = isFree ? "Выдано" : "Продано";
  const newPrice = isFree ? 0 : (price ?? loot.item_type?.price ?? 0);

  const { error: updateError } = await supabase
    .from("loot")
    .update({
      quantity,
      sold_to: soldTo,
      sold_to_user_id: soldToId ?? null,
      comment,
      status: newStatus,
      price: newPrice,
    })
    .eq("id", lootId);

  if (updateError) {
    console.error(updateError);
    throw new Error("Ошибка при обновлении записи о продаже");
  }

  const { data: existingInventory } = await supabase
    .from("user_inventory")
    .select("id")
    .eq("loot_id", lootId)
    .maybeSingle();

  if (soldToId) {
    if (existingInventory) {
      const { error: inventoryUpdateError } = await supabase
        .from("user_inventory")
        .update({
          user_id: soldToId,
          name: loot.item_type.name,
          type: isFree ? "Выдано" : "Куплено",
          quantity,
        })
        .eq("id", existingInventory.id);

      if (inventoryUpdateError) {
        console.error(inventoryUpdateError);
        throw new Error("Ошибка при обновлении инвентаря");
      }
    } else {
      const { error: inventoryInsertError } = await supabase
        .from("user_inventory")
        .insert([
          {
            user_id: soldToId,
            name: loot.item_type.name,
            type: isFree ? "Выдано" : "Куплено",
            created_at: new Date().toISOString(),
            quantity,
            loot_id: lootId,
          },
        ]);

      if (inventoryInsertError) {
        console.error(inventoryInsertError);
        throw new Error("Ошибка при добавлении предмета в инвентарь");
      }
    }
  } else if (existingInventory) {
    // Покупателя сменили на произвольный текст без привязки к аккаунту —
    // запись в инвентаре аккаунта больше не актуальна
    await supabase
      .from("user_inventory")
      .delete()
      .eq("id", existingInventory.id);
  }

  // Цена/статус (платно↔бесплатно) могли измениться в любую сторону —
  // пересчитываем безусловно. sold_at не менялся, так что месяц дохода
  // остаётся прежним.
  if (loot.sold_at) {
    const soldAtDate = new Date(loot.sold_at);
    await triggerFinanceRecalc(soldAtDate.getMonth() + 1, soldAtDate.getFullYear());
  }
}
