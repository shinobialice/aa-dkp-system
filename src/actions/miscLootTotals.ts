"use server";

import supabase from "@/shared/lib/supabaseAdmin";
import { MISC_LOOT_ITEM_NAMES } from "@/widgets/Loot/GuildLoot/LootTypes";

export async function getMiscLootTotals(month: number, year: number) {
  const { data, error } = await supabase
    .from("misc_loot_totals")
    .select("item_name, amount")
    .eq("month", month)
    .eq("year", year);

  if (error) {
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
  const { error } = await supabase.from("misc_loot_totals").upsert(
    {
      item_name: name,
      month,
      year,
      amount,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "item_name,month,year" },
  );

  if (error) {
    console.error(error);
    throw new Error("Не удалось сохранить сумму");
  }
}
