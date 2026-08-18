"use server";

import sql from "@/shared/lib/db";
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
  const [loot] = await sql<any[]>`
    SELECT l.*, it.name AS item_type_name, it.price AS item_type_price
    FROM loot l
    JOIN item_type it ON it.id = l.item_type_id
    WHERE l.id = ${lootId}
  `;

  if (!loot || !loot.quantity || loot.quantity < quantity) {
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

  await sql<any[]>`
    UPDATE loot SET quantity = ${remainingQuantity}, status = ${newStatus} WHERE id = ${lootId}
  `;

  // 3. Insert new loot record for the distributed portion
  const soldAt = new Date().toISOString();
  let created;
  try {
    [created] = await sql<any[]>`
      INSERT INTO loot
        (item_type_id, source, acquired_at, quantity, sold_to, sold_to_user_id, sold_at, comment, status, price, created_at)
      VALUES (
        ${loot.item_type_id}, ${loot.source}, ${loot.acquired_at ?? soldAt}, ${quantity},
        ${soldTo}, ${soldToId ?? null}, ${soldAt}, ${comment ?? null},
        ${isFree ? "Выдано" : "Продано"}, ${isFree ? 0 : (price ?? loot.item_type_price ?? 0)}, now()
      )
      RETURNING *
    `;
  } catch (createError) {
    console.error(createError);
    throw new Error("Ошибка при создании новой записи лута");
  }

  if (!created) {
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
      let existingInventory;
      try {
        existingInventory = await sql<any[]>`
          SELECT id FROM user_inventory
          WHERE user_id = ${soldToId} AND name = ${loot.item_type_name}
          LIMIT 1
        `;
      } catch (inventoryFindError) {
        console.error(inventoryFindError);
        throw new Error("Не удалось проверить инвентарь");
      }

      skipInsert = (existingInventory?.length ?? 0) > 0;
    }

    if (!skipInsert) {
      try {
        await sql<any[]>`
          INSERT INTO user_inventory (user_id, name, type, created_at, quantity, loot_id)
          VALUES (${soldToId}, ${loot.item_type_name}, ${isFree ? "Выдано" : "Куплено"}, now(), ${quantity}, ${created.id})
        `;
      } catch (inventoryError) {
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
  const [loot] = await sql<any[]>`
    SELECT l.*, it.name AS item_type_name, it.price AS item_type_price
    FROM loot l
    JOIN item_type it ON it.id = l.item_type_id
    WHERE l.id = ${lootId}
  `;

  if (!loot) {
    throw new Error("Запись о продаже не найдена");
  }

  const newStatus = isFree ? "Выдано" : "Продано";
  const newPrice = isFree ? 0 : (price ?? loot.item_type_price ?? 0);

  try {
    await sql<any[]>`
      UPDATE loot SET
        quantity = ${quantity},
        sold_to = ${soldTo},
        sold_to_user_id = ${soldToId ?? null},
        comment = ${comment ?? null},
        status = ${newStatus},
        price = ${newPrice}
      WHERE id = ${lootId}
    `;
  } catch (updateError) {
    console.error(updateError);
    throw new Error("Ошибка при обновлении записи о продаже");
  }

  const [existingInventory] = await sql<any[]>`
    SELECT id FROM user_inventory WHERE loot_id = ${lootId}
  `;

  if (soldToId) {
    if (existingInventory) {
      try {
        await sql<any[]>`
          UPDATE user_inventory SET
            user_id = ${soldToId},
            name = ${loot.item_type_name},
            type = ${isFree ? "Выдано" : "Куплено"},
            quantity = ${quantity}
          WHERE id = ${existingInventory.id}
        `;
      } catch (inventoryUpdateError) {
        console.error(inventoryUpdateError);
        throw new Error("Ошибка при обновлении инвентаря");
      }
    } else {
      try {
        await sql<any[]>`
          INSERT INTO user_inventory (user_id, name, type, created_at, quantity, loot_id)
          VALUES (${soldToId}, ${loot.item_type_name}, ${isFree ? "Выдано" : "Куплено"}, now(), ${quantity}, ${lootId})
        `;
      } catch (inventoryInsertError) {
        console.error(inventoryInsertError);
        throw new Error("Ошибка при добавлении предмета в инвентарь");
      }
    }
  } else if (existingInventory) {
    // Покупателя сменили на произвольный текст без привязки к аккаунту —
    // запись в инвентаре аккаунта больше не актуальна
    await sql<any[]>`DELETE FROM user_inventory WHERE id = ${existingInventory.id}`;
  }

  // Цена/статус (платно↔бесплатно) могли измениться в любую сторону —
  // пересчитываем безусловно. sold_at не менялся, так что месяц дохода
  // остаётся прежним.
  if (loot.sold_at) {
    const soldAtDate = new Date(loot.sold_at);
    await triggerFinanceRecalc(soldAtDate.getMonth() + 1, soldAtDate.getFullYear());
  }
}
