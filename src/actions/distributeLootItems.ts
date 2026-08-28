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
  soldAt: soldAtInput,
}: {
  lootId: number;
  quantity: number;
  soldTo: string;
  soldToId?: number;
  isFree: boolean;
  comment?: string;
  price?: number;
  // Позволяет продать/выдать предмет задним числом (например, продажа
  // в августе оформляется в сентябре) — тогда доход считается за месяц
  // этой даты, а не за месяц фактического нажатия кнопки.
  soldAt?: string;
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

  // Шаги 2-3-5 оборачиваем в одну транзакцию: раньше это были отдельные
  // запросы, и если INSERT записи о продаже падал (например, из-за
  // рассинхрона serial-последовательности после миграции с Supabase — см.
  // "duplicate key value violates unique constraint loot_pkey"), UPDATE
  // остатка уже успевал закоммититься — предмет тихо исчезал из наличия
  // без единой записи о том, что он вообще продан. Теперь при ошибке на
  // любом шаге откатывается всё целиком.
  const soldAt = soldAtInput
    ? new Date(soldAtInput).toISOString()
    : new Date().toISOString();
  let created: any;
  try {
    await sql.begin(async (sql) => {
      await sql<any[]>`
        UPDATE loot SET quantity = ${remainingQuantity}, status = ${newStatus} WHERE id = ${lootId}
      `;

      // 3. Insert new loot record for the distributed portion
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

      if (!created) {
        throw new Error("Ошибка при создании новой записи лута");
      }

      // 5. Add to user inventory if applicable
      if (soldToId) {
        let skipInsert = false;

        if (isFree) {
          const existingInventory = await sql<any[]>`
            SELECT id FROM user_inventory
            WHERE user_id = ${soldToId} AND name = ${loot.item_type_name}
            LIMIT 1
          `;

          skipInsert = (existingInventory?.length ?? 0) > 0;
        }

        if (!skipInsert) {
          await sql<any[]>`
            INSERT INTO user_inventory (user_id, name, type, created_at, quantity, loot_id)
            VALUES (${soldToId}, ${loot.item_type_name}, ${isFree ? "Выдано" : "Куплено"}, now(), ${quantity}, ${created.id})
          `;
        }
      }
    });
  } catch (txError) {
    console.error(txError);
    throw new Error("Ошибка при создании новой записи лута");
  }

  if (!isFree) {
    const soldAtDate = new Date(soldAt);
    await triggerFinanceRecalc(soldAtDate.getMonth() + 1, soldAtDate.getFullYear());
  }
}

// Редактирование уже существующей продажи/выдачи. В отличие от
// distributeLootItem — это правит запись на месте, а не создаёт новую,
// чтобы не задваивать доход казны (generateGuildFunds считает по
// status = "Продано" без учёта quantity) и не плодить дубликаты в
// инвентаре покупателя. acquired_at не трогаем; sold_at можно передать
// явно — например, чтобы задним числом перенести продажу в август, хотя
// правится она уже в сентябре (см. soldAt ниже).
export async function updateLootSale({
  lootId,
  quantity,
  soldTo,
  soldToId,
  isFree,
  comment,
  price,
  soldAt: soldAtInput,
}: {
  lootId: number;
  quantity: number;
  soldTo: string;
  soldToId?: number;
  isFree: boolean;
  comment?: string;
  price?: number;
  soldAt?: string;
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
  const newSoldAt = soldAtInput
    ? new Date(soldAtInput).toISOString()
    : loot.sold_at;

  // Как и в distributeLootItem — правка записи и синхронизация инвентаря
  // раньше были отдельными запросами; при падении любого из них загруженная
  // цена/покупатель на loot могли разойтись с user_inventory. Оборачиваем в
  // транзакцию, чтобы падение любого шага откатывало всё целиком.
  try {
    await sql.begin(async (sql) => {
      await sql<any[]>`
        UPDATE loot SET
          quantity = ${quantity},
          sold_to = ${soldTo},
          sold_to_user_id = ${soldToId ?? null},
          comment = ${comment ?? null},
          status = ${newStatus},
          price = ${newPrice},
          sold_at = ${newSoldAt}
        WHERE id = ${lootId}
      `;

      const [existingInventory] = await sql<any[]>`
        SELECT id FROM user_inventory WHERE loot_id = ${lootId}
      `;

      if (soldToId) {
        if (existingInventory) {
          await sql<any[]>`
            UPDATE user_inventory SET
              user_id = ${soldToId},
              name = ${loot.item_type_name},
              type = ${isFree ? "Выдано" : "Куплено"},
              quantity = ${quantity}
            WHERE id = ${existingInventory.id}
          `;
        } else {
          await sql<any[]>`
            INSERT INTO user_inventory (user_id, name, type, created_at, quantity, loot_id)
            VALUES (${soldToId}, ${loot.item_type_name}, ${isFree ? "Выдано" : "Куплено"}, now(), ${quantity}, ${lootId})
          `;
        }
      } else if (existingInventory) {
        // Покупателя сменили на произвольный текст без привязки к аккаунту —
        // запись в инвентаре аккаунта больше не актуальна
        await sql<any[]>`DELETE FROM user_inventory WHERE id = ${existingInventory.id}`;
      }
    });
  } catch (txError) {
    console.error(txError);
    throw new Error("Ошибка при обновлении записи о продаже");
  }

  // Цена/статус (платно↔бесплатно) могли измениться в любую сторону, а
  // sold_at теперь тоже можно перенести на другой месяц (например, задним
  // числом в август) — пересчитываем и старый, и новый месяц, если дата
  // продажи сдвинулась, чтобы доход не завис в прежнем месяце.
  const monthsToRecalc = new Set<string>();
  if (loot.sold_at) {
    const oldDate = new Date(loot.sold_at);
    monthsToRecalc.add(`${oldDate.getFullYear()}-${oldDate.getMonth() + 1}`);
  }
  if (newSoldAt) {
    const newDate = new Date(newSoldAt);
    monthsToRecalc.add(`${newDate.getFullYear()}-${newDate.getMonth() + 1}`);
  }
  for (const key of monthsToRecalc) {
    const [year, month] = key.split("-").map(Number);
    await triggerFinanceRecalc(month, year);
  }
}
