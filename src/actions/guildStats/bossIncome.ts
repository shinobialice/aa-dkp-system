"use server";

import sql from "@/shared/lib/db";
import { MISC_LOOT_ITEM_NAMES } from "@/widgets/Loot/GuildLoot/LootTypes";

export type BossIncomeStat = {
  boss: string;
  income: number;
  itemsSold: number;
};

export async function getBossIncomeByMonth(
  month: number,
  year: number,
): Promise<BossIncomeStat[]> {
  const startDate = new Date(Date.UTC(year, month - 1, 1));
  const endDate = new Date(
    Date.UTC(month === 12 ? year + 1 : year, month % 12, 1),
  );

  let data;
  try {
    data = await sql<any[]>`
      SELECT source, price, quantity FROM loot
      WHERE status = 'Продано'
        AND sold_at >= ${startDate.toISOString()}
        AND sold_at < ${endDate.toISOString()}
    `;
  } catch (error) {
    console.error("Ошибка при получении дохода по боссам:", error);
    throw new Error("Не удалось загрузить доход по боссам");
  }

  const totals = new Map<string, { income: number; itemsSold: number }>();

  for (const row of data ?? []) {
    const boss = row.source ?? "Без источника";
    const prev = totals.get(boss) ?? { income: 0, itemsSold: 0 };
    totals.set(boss, {
      income: prev.income + (row.price ?? 0),
      itemsSold: prev.itemsSold + (row.quantity ?? 0),
    });
  }

  // Эссенции акхиума / Всякие мелочи / Всякие мелочи 2 не заводятся как
  // обычные строки лута с источником — их доход ведётся помесячной суммой
  // в misc_loot_totals (см. MISC_LOOT_ITEM_NAMES, MiscLootSummary), поэтому
  // без этого блока они вообще не попадали бы в разбивку по боссам. По сути
  // это фарм-доход не от конкретного праймового босса, поэтому приплюсовываем
  // его к "АГЛ".
  let miscTotals;
  try {
    miscTotals = await sql<any[]>`
      SELECT amount FROM misc_loot_totals
      WHERE month = ${month} AND year = ${year}
        AND item_name = ANY(${MISC_LOOT_ITEM_NAMES})
    `;
  } catch (error) {
    console.error("Ошибка при получении сумм по разному:", error);
    throw new Error("Не удалось загрузить доход по боссам");
  }

  const miscIncome = (miscTotals ?? []).reduce(
    (sum, row) => sum + (row.amount ?? 0),
    0,
  );

  if (miscIncome) {
    const prev = totals.get("АГЛ") ?? { income: 0, itemsSold: 0 };
    totals.set("АГЛ", { income: prev.income + miscIncome, itemsSold: prev.itemsSold });
  }

  return Array.from(totals.entries())
    .map(([boss, v]) => ({ boss, income: v.income, itemsSold: v.itemsSold }))
    .sort((a, b) => b.income - a.income);
}
