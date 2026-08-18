"use server";

import sql from "@/shared/lib/db";
import { MISC_LOOT_ITEM_NAMES } from "@/widgets/Loot/GuildLoot/LootTypes";
import { triggerFinanceRecalc } from "./recalculateFinanceForMonth";

export async function getMiscLootTotals(month: number, year: number) {
  let data;
  try {
    data = await sql<any[]>`
      SELECT item_name, amount FROM misc_loot_totals
      WHERE month = ${month} AND year = ${year}
    `;
  } catch (error) {
    console.error(error);
    throw new Error("Не удалось получить суммы по разному");
  }

  const amounts = new Map(data?.map((row) => [row.item_name, row.amount]));

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
  try {
    await sql<any[]>`
      INSERT INTO misc_loot_totals (item_name, month, year, amount, updated_at)
      VALUES (${name}, ${month}, ${year}, ${amount}, now())
      ON CONFLICT (item_name, month, year) DO UPDATE SET
        amount = EXCLUDED.amount,
        updated_at = EXCLUDED.updated_at
    `;
  } catch (error) {
    console.error(error);
    throw new Error("Не удалось сохранить сумму");
  }

  await triggerFinanceRecalc(month, year);
}
