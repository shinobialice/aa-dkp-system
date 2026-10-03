"use server";

import sql from "@/shared/lib/db";
import { MISC_LOOT_ITEM_NAMES } from "@/shared/config/miscLoot";

export type BossIncomeStat = {
  boss: string;
  income: number;
  itemsSold: number;
};

const FARM_INCOME_BOSS = "АГЛ";

export async function getBossIncomeByMonth(
  month: number,
  year: number,
): Promise<BossIncomeStat[]> {
  const startDate = new Date(Date.UTC(year, month - 1, 1)).toISOString();
  const endDate = new Date(Date.UTC(year, month, 1)).toISOString();

  let sales: BossIncomeStat[];
  let miscIncome: number;
  try {
    [sales, [{ miscIncome }]] = await Promise.all([
      sql<BossIncomeStat[]>`
        SELECT
          COALESCE(source, 'Без источника') AS boss,
          COALESCE(SUM(price), 0)::float8 AS income,
          COALESCE(SUM(quantity), 0)::int AS "itemsSold"
        FROM loot
        WHERE status = 'Продано'
          AND sold_at >= ${startDate}
          AND sold_at < ${endDate}
        GROUP BY 1
      `,
      sql<{ miscIncome: number }[]>`
        SELECT COALESCE(SUM(amount), 0)::float8 AS "miscIncome"
        FROM misc_loot_totals
        WHERE month = ${month} AND year = ${year}
          AND item_name = ANY(${MISC_LOOT_ITEM_NAMES})
      `,
    ]);
  } catch (error) {
    console.error("Ошибка при получении дохода по боссам:", error);
    throw new Error("Не удалось загрузить доход по боссам");
  }

  return addFarmIncome(sales, miscIncome).sort((a, b) => b.income - a.income);
}

// Мелочи и эссенции ведутся помесячной суммой без источника; по сути это
// фарм-доход, поэтому он приплюсовывается к АГЛ.
function addFarmIncome(sales: BossIncomeStat[], miscIncome: number) {
  if (!miscIncome) return sales;
  if (!sales.some((stat) => stat.boss === FARM_INCOME_BOSS)) {
    return [
      ...sales,
      { boss: FARM_INCOME_BOSS, income: miscIncome, itemsSold: 0 },
    ];
  }
  return sales.map((stat) =>
    stat.boss === FARM_INCOME_BOSS
      ? { ...stat, income: stat.income + miscIncome }
      : stat,
  );
}
