"use server";

import { triggerFinanceRecalc } from "@/server/finance/recalc";
import { distributeLot, type StockLotRow } from "@/server/lootDistribution";
import { syncTreasuryGiveaway } from "@/server/syncTreasuryGiveaway";
import sql from "@/shared/lib/db";
import type { ItemTypeRow, UserInventoryRow } from "@/shared/lib/dbTypes";
import { getUtcYearMonth } from "@/utils/getUtcYearMonth";
import ensurePrivilieges from "./ensurePrivilieges";

type SaleLotRow = StockLotRow & { item_type_price: ItemTypeRow["price"] };

export async function distributeLootStock({
  itemTypeId,
  quantity,
  soldTo,
  soldToId,
  isFree,
  comment,
  price,
  soldAt: soldAtInput,
}: {
  itemTypeId: number;
  quantity: number;
  soldTo: string;
  soldToId?: number;
  isFree: boolean;
  comment?: string;
  price: number;
  // Позволяет продать/выдать предмет задним числом (например, продажа
  // в августе оформляется в сентябре) — тогда доход считается за месяц
  // этой даты, а не за месяц фактического нажатия кнопки.
  soldAt?: string;
}) {
  await ensurePrivilieges(["Администратор"]);

  if (!Number.isInteger(quantity) || quantity < 1) {
    throw new Error("Количество должно быть больше нуля");
  }
  if (!soldTo.trim()) {
    throw new Error("Укажите, кому продать или выдать");
  }

  const total = isFree ? 0 : Math.max(0, Math.round(price));
  const soldAt = new Date(soldAtInput ?? Date.now()).toISOString();

  // Списание остатка и запись о продаже — одна транзакция: иначе при падении
  // INSERT продажи UPDATE остатка уже успевал закоммититься, и предмет тихо
  // исчезал из наличия без записи о том, что он вообще продан.
  try {
    await sql.begin(async (tx) => {
      const lots = await tx<StockLotRow[]>`
        SELECT l.*, it.name AS item_type_name
        FROM loot l
        JOIN item_type it ON it.id = l.item_type_id
        WHERE l.item_type_id = ${itemTypeId} AND l.status = 'В наличии' AND l.quantity > 0
        ORDER BY l.acquired_at ASC NULLS LAST, l.id ASC
        FOR UPDATE OF l
      `;

      const available = lots.reduce((sum, lot) => sum + lot.quantity, 0);
      if (available < quantity) {
        throw new Error("Недостаточно предметов на складе");
      }

      let left = quantity;
      let priceLeft = total;
      for (const lot of lots) {
        if (left === 0) break;
        const take = Math.min(lot.quantity, left);
        const lotPrice =
          take === left ? priceLeft : Math.round((total * take) / quantity);
        await distributeLot(tx, lot, {
          quantity: take,
          soldTo,
          soldToId,
          isFree,
          comment,
          price: lotPrice,
          soldAt,
        });
        left -= take;
        priceLeft -= lotPrice;
      }
    });
  } catch (error) {
    console.error(error);
    throw new Error(
      isFree ? "Не удалось выдать предметы" : "Не удалось продать предметы",
    );
  }

  if (!isFree) {
    const { year, month } = getUtcYearMonth(new Date(soldAt));
    await triggerFinanceRecalc(month, year);
  }
}

// Правка уже оформленной продажи/выдачи на месте, без нового списания со
// склада: иначе задвоился бы доход казны и появились бы дубликаты в инвентаре
// покупателя. acquired_at не трогаем; sold_at можно перенести, например,
// задним числом в август, хотя правится запись уже в сентябре.
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
  await ensurePrivilieges(["Администратор"]);

  const [loot] = await sql<SaleLotRow[]>`
    SELECT l.*, it.name AS item_type_name, it.price AS item_type_price
    FROM loot l
    JOIN item_type it ON it.id = l.item_type_id
    WHERE l.id = ${lootId}
  `;
  if (!loot) throw new Error("Запись о продаже не найдена");

  const inventoryType = isFree ? "Выдано" : "Куплено";
  const newPrice = isFree ? 0 : (price ?? loot.item_type_price ?? 0);
  const newSoldAt = soldAtInput
    ? new Date(soldAtInput).toISOString()
    : loot.sold_at;

  try {
    await sql.begin(async (tx) => {
      await tx`
        UPDATE loot SET
          quantity = ${quantity},
          sold_to = ${soldTo},
          sold_to_user_id = ${soldToId ?? null},
          comment = ${comment ?? null},
          status = ${isFree ? "Выдано" : "Продано"},
          price = ${newPrice},
          sold_at = ${newSoldAt}
        WHERE id = ${lootId}
      `;

      const [inventory] = await tx<Pick<UserInventoryRow, "id">[]>`
        SELECT id FROM user_inventory WHERE loot_id = ${lootId}
      `;

      // Покупателя сменили на произвольный текст без привязки к аккаунту —
      // запись в инвентаре аккаунта больше не актуальна.
      if (!soldToId) {
        if (inventory) {
          await tx`DELETE FROM user_inventory WHERE id = ${inventory.id}`;
        }
        return;
      }

      if (inventory) {
        await tx`
          UPDATE user_inventory SET
            user_id = ${soldToId}, name = ${loot.item_type_name},
            type = ${inventoryType}, quantity = ${quantity}
          WHERE id = ${inventory.id}
        `;
      } else {
        await tx`
          INSERT INTO user_inventory (user_id, name, type, created_at, quantity, loot_id)
          VALUES (${soldToId}, ${loot.item_type_name}, ${inventoryType}, now(), ${quantity}, ${lootId})
        `;
      }

      if (isFree) {
        await syncTreasuryGiveaway(tx, {
          treasuryName: loot.item_type_name,
          userId: soldToId,
          givenAt: newSoldAt ?? new Date().toISOString(),
        });
      }
    });
  } catch (error) {
    console.error(error);
    throw new Error("Ошибка при обновлении записи о продаже");
  }

  // Цена/статус могли измениться в любую сторону, а дата продажи — уехать в
  // другой месяц: пересчитываем и старый, и новый месяц.
  const dates = [loot.sold_at, soldAtInput].filter(
    (date): date is string => !!date,
  );
  const months = new Set(
    dates.map((date) => {
      const { year, month } = getUtcYearMonth(new Date(date));
      return `${year}-${month}`;
    }),
  );
  for (const key of months) {
    const [year, month] = key.split("-").map(Number);
    await triggerFinanceRecalc(month, year);
  }
}
