"use server";

import { triggerFinanceRecalc } from "@/server/finance/recalc";
import { publishChanges } from "@/server/liveChanges";
import sql from "@/shared/lib/db";
import type { ItemTypeRow, LootRow } from "@/shared/lib/dbTypes";
import { getUtcYearMonth } from "@/utils/getUtcYearMonth";
import ensurePrivilieges from "./ensurePrivilieges";

type LootQueryRow = LootRow & {
  item_type_pk: ItemTypeRow["id"];
  item_type_name: ItemTypeRow["name"];
  item_type_price: ItemTypeRow["price"];
  item_type_icon_url: ItemTypeRow["icon_url"];
  item_type_grade: ItemTypeRow["grade"];
};

export type TreasuryLoot = Awaited<ReturnType<typeof getLoot>>[number];

export const getItemTypes = async () => {
  try {
    return await sql<Pick<ItemTypeRow, "id" | "name" | "icon_url" | "grade">[]>`
      SELECT id, name, icon_url, grade FROM item_type
    `;
  } catch (error) {
    console.error("Ошибка при получении типов предметов:", error);
    throw new Error("Не удалось загрузить типы предметов");
  }
};

export async function getLoot() {
  let rows: LootQueryRow[];
  try {
    rows = await sql<LootQueryRow[]>`
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

  return rows.map(
    ({
      item_type_pk,
      item_type_name,
      item_type_price,
      item_type_icon_url,
      item_type_grade,
      ...loot
    }) => ({
      ...loot,
      itemType: {
        id: item_type_pk,
        name: item_type_name,
        price: item_type_price,
        icon_url: item_type_icon_url,
        grade: item_type_grade,
      },
    }),
  );
}

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
  await ensurePrivilieges(["Администратор"]);

  try {
    await sql`
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
  await publishChanges("loot");

  // "В казну"/"Продано" сразу с income (quick-add в казну из AddLootDialog) —
  // пересчитываем фонд месяца продажи сразу.
  if (sold_at && (status === "В казну" || status === "Продано")) {
    const { year, month } = getUtcYearMonth(new Date(sold_at));
    await triggerFinanceRecalc(month, year);
  }
};

// Правка ручной строки дохода "В казну": это не продажа покупателю, а просто
// сумма/источник/дата поступления. sold_at (месяц, за который считается
// доход фонда) не трогаем — правка суммы не должна тихо переносить доход в
// другой месяц.
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
  await ensurePrivilieges(["Администратор"]);

  let updated: Pick<LootRow, "sold_at"> | undefined;
  try {
    [updated] = await sql<Pick<LootRow, "sold_at">[]>`
      UPDATE loot SET
        source = ${source ?? null},
        acquired_at = ${new Date(acquired_at).toISOString()},
        quantity = 1,
        price = ${price}
      WHERE id = ${lootId} AND status = 'В казну'
      RETURNING sold_at
    `;
  } catch (error) {
    console.error("Ошибка при изменении поступления в казну:", error);
    throw new Error("Не удалось изменить поступление в казну");
  }
  if (!updated) throw new Error("Запись не найдена");
  await publishChanges("loot");

  if (updated.sold_at) {
    const { year, month } = getUtcYearMonth(new Date(updated.sold_at));
    await triggerFinanceRecalc(month, year);
  }
};
