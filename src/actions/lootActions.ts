"use server";

import sql from "@/shared/lib/db";
import { triggerFinanceRecalc } from "./recalculateFinanceForMonth";

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
}: {
  itemTypeId: number;
  source?: string;
  acquired_at: string;
  quantity?: number;
  status?: string;
  sold_at?: string;
  raidId?: number | null;
}) => {
  try {
    await sql<any[]>`
      INSERT INTO loot (item_type_id, status, sold_at, source, acquired_at, quantity, created_at, raid_id)
      VALUES (
        ${itemTypeId}, ${status ?? "В наличии"}, ${sold_at ?? null}, ${source ?? null},
        ${new Date(acquired_at).toISOString()}, ${quantity ?? 1}, now(), ${raidId ?? null}
      )
    `;
  } catch (error) {
    console.error("Ошибка при добавлении лута:", error);
    throw new Error("Не удалось добавить предмет");
  }

  // "В казну"/"Продано" сразу с income (см. AddLootDialog — quick-add в
  // казну) — пересчитываем фонд месяца продажи, не дожидаясь таймера.
  if (sold_at && (status === "В казну" || status === "Продано")) {
    const soldAt = new Date(sold_at);
    await triggerFinanceRecalc(soldAt.getMonth() + 1, soldAt.getFullYear());
  }
};
