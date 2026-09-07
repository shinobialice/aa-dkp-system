"use server";

import sql from "@/shared/lib/db";
import { triggerFinanceRecalc } from "./recalculateFinanceForMonth";
import { getUtcYearMonth } from "@/utils/getUtcYearMonth";

// Get list of item types
export const getItemTypes = async () => {
  try {
    return await sql<any[]>`SELECT id, name, icon_url, grade FROM item_type`;
  } catch (error) {
    console.error("Ошибка при получении типов предметов:", error);
    throw new Error("Не удалось загрузить типы предметов");
  }
};

// Get loot list with itemType
export async function getLoot() {
  let rows;
  try {
    rows = await sql<any[]>`
      SELECT
        l.*,
        it.id AS item_type_pk, it.name AS item_type_name, it.price AS item_type_price,
        it.icon_url AS item_type_icon_url, it.grade AS item_type_grade
      FROM loot l
      JOIN item_type it ON it.id = l.item_type_id
      ORDER BY l.acquired_at ASC
    `;
  } catch (error) {
    console.error("Ошибка при загрузке лута:", error);
    return [];
  }

  return rows.map((row) => {
    const {
      item_type_pk,
      item_type_name,
      item_type_price,
      item_type_icon_url,
      item_type_grade,
      ...loot
    } = row;
    return {
      ...loot,
      itemType: {
        id: item_type_pk,
        name: item_type_name,
        price: item_type_price,
        icon_url: item_type_icon_url,
        grade: item_type_grade,
      },
    };
  });
}

// Add loot item
export const addLootItem = async ({
  itemTypeId,
  source,
  acquired_at,
  quantity,
  status,
  sold_at,
  raidId,
  price,
}: {
  itemTypeId: number;
  source?: string;
  acquired_at: string;
  quantity?: number;
  status?: string;
  sold_at?: string;
  raidId?: number | null;
  price?: number;
}) => {
  try {
    await sql<any[]>`
      INSERT INTO loot (item_type_id, status, sold_at, source, acquired_at, quantity, created_at, raid_id, price)
      VALUES (
        ${itemTypeId}, ${status ?? "В наличии"}, ${sold_at ?? null}, ${source ?? null},
        ${new Date(acquired_at).toISOString()}, ${quantity ?? 1}, now(), ${raidId ?? null}, ${price ?? null}
      )
    `;
  } catch (error) {
    console.error("Ошибка при добавлении лута:", error);
    throw new Error("Не удалось добавить предмет");
  }

  // "В казну"/"Продано" сразу с income (см. AddLootDialog — quick-add в
  // казну) — пересчитываем фонд месяца продажи, не дожидаясь таймера.
  if (sold_at && (status === "В казну" || status === "Продано")) {
    const { year, month } = getUtcYearMonth(new Date(sold_at));
    await triggerFinanceRecalc(month, year);
  }
};

// Правка уже занесённой в казну ручной строки дохода ("В казну" — см.
// AddLootDialog/lootUtilityItems.ts). В отличие от updateLootSale — это не
// продажа предмету покупателю, а просто сумма/источник/дата поступления,
// поэтому отдельная узкая функция вместо переиспользования той. sold_at
// (месяц, за который считается доход в generateGuildFunds) не трогаем —
// правка суммы/источника не должна тихо переносить доход в другой месяц.
export const updateTreasuryIncome = async ({
  lootId,
  source,
  acquired_at,
  price,
}: {
  lootId: number;
  source?: string;
  acquired_at: string;
  price: number;
}) => {
  let sold_at: Date | null = null;
  try {
    const [loot] = await sql<any[]>`
      UPDATE loot SET
        source = ${source ?? null},
        acquired_at = ${new Date(acquired_at).toISOString()},
        quantity = 1,
        price = ${price}
      WHERE id = ${lootId} AND status = 'В казну'
      RETURNING sold_at
    `;
    if (!loot) {
      throw new Error("Запись не найдена");
    }
    sold_at = loot.sold_at;
  } catch (error) {
    console.error("Ошибка при изменении поступления в казну:", error);
    throw new Error("Не удалось изменить поступление в казну");
  }

  if (sold_at) {
    const { year, month } = getUtcYearMonth(new Date(sold_at));
    await triggerFinanceRecalc(month, year);
  }
};
