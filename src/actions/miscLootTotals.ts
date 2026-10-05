"use server";

import { triggerFinanceRecalc } from "@/server/finance/recalc";
import { publishChanges } from "@/server/liveChanges";
import sql from "@/shared/lib/db";
import type { MiscLootTotalsRow } from "@/shared/lib/dbTypes";
import { MISC_LOOT_ITEM_NAMES } from "@/shared/config/miscLoot";
import ensurePrivilieges from "./ensurePrivilieges";

export async function getMiscLootTotals(month: number, year: number) {
  let rows: Pick<MiscLootTotalsRow, "item_name" | "amount">[];
  try {
    rows = await sql<Pick<MiscLootTotalsRow, "item_name" | "amount">[]>`
      SELECT item_name, amount FROM misc_loot_totals
      WHERE month = ${month} AND year = ${year}
    `;
  } catch (error) {
    console.error("Ошибка при получении сумм по разному:", error);
    throw new Error("Не удалось получить суммы по разному");
  }

  const amounts = new Map(rows.map((row) => [row.item_name, row.amount]));
  return MISC_LOOT_ITEM_NAMES.map((name) => ({
    name,
    amount: amounts.get(name) ?? 0,
  }));
}

export async function setMiscLootTotal({
  name,
  month,
  year,
  amount,
}: {
  name: string;
  month: number;
  year: number;
  amount: number;
}) {
  await ensurePrivilieges(["Администратор"]);

  try {
    await sql`
      INSERT INTO misc_loot_totals (item_name, month, year, amount, updated_at)
      VALUES (${name}, ${month}, ${year}, ${amount}, now())
      ON CONFLICT (item_name, month, year) DO UPDATE SET
        amount = EXCLUDED.amount,
        updated_at = EXCLUDED.updated_at
    `;
  } catch (error) {
    console.error("Ошибка при сохранении суммы по разному:", error);
    throw new Error("Не удалось сохранить сумму");
  }
  await publishChanges("loot");

  await triggerFinanceRecalc(month, year);
}
