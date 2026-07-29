"use server";

import supabase from "@/shared/lib/supabase";

export async function getLootStock() {
  const { data, error } = await supabase
    .from("loot")
    .select("quantity, item_type(name)")
    .eq("status", "В наличии");

  if (error || !data) {
    console.error("Ошибка при получении остатков лута:", error);
    throw new Error("Не удалось получить остатки лута");
  }

  const stock: Record<string, number> = {};
  for (const row of data as any[]) {
    const name = row.item_type?.name;
    if (!name) continue;
    stock[name] = (stock[name] ?? 0) + (row.quantity ?? 0);
  }

  return stock;
}
