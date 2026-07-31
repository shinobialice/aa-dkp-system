"use server";

import supabase from "@/shared/lib/supabaseAdmin";

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

  const { data, error } = await supabase
    .from("loot")
    .select("source, price, quantity")
    .eq("status", "Продано")
    .gte("sold_at", startDate.toISOString())
    .lt("sold_at", endDate.toISOString());

  if (error) {
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

  return Array.from(totals.entries())
    .map(([boss, v]) => ({ boss, income: v.income, itemsSold: v.itemsSold }))
    .sort((a, b) => b.income - a.income);
}
