"use server";

import sql from "@/shared/lib/db";

export async function getLootStock() {
  let data;
  try {
    data = await sql<any[]>`
      SELECT l.quantity, it.name AS item_name
      FROM loot l
      JOIN item_type it ON it.id = l.item_type_id
      WHERE l.status = 'В наличии'
    `;
  } catch (error) {
    console.error("Ошибка при получении остатков лута:", error);
    throw new Error("Не удалось получить остатки лута");
  }

  const stock: Record<string, number> = {};
  for (const row of data) {
    const name = row.item_name;
    if (!name) continue;
    stock[name] = (stock[name] ?? 0) + (row.quantity ?? 0);
  }

  return stock;
}
