import sql from "@/shared/lib/db";
import type { ItemTypeRow } from "@/shared/lib/dbTypes";

type BuyableItem = Pick<ItemTypeRow, "name" | "price" | "grade"> & {
  icon: string | null;
  source: string;
};

const MISC_ORDER = [
  "Средоточие морей",
  "Средоточие безумия",
  "Средоточие ярости",
  "Средоточие сумрака",
  "Аметистовая гравировка северной звезды",
  "Трофейная эссенция стихий",
  "Эссенция ярости",
  "Свиток пробудившихся легенд",
  "Свиток пробудившихся мифов",
  "Свиток пробуждения драконоборца",
  "Глайдер «Крылья небесного стража»",
  "Акхиумная сфера",
];

export async function getLootGrouped() {
  let items: BuyableItem[];
  try {
    items = await sql<BuyableItem[]>`
      SELECT name, price, icon_url AS icon, grade, COALESCE(NULLIF(source, ''), 'Разное') AS source
      FROM item_type
      WHERE show_in_buy
    `;
  } catch (error) {
    console.error("Ошибка при загрузке предметов:", error);
    throw new Error("Не удалось получить список предметов");
  }

  const grouped: Record<string, Omit<BuyableItem, "source">[]> = {};
  for (const { source, ...item } of items) {
    (grouped[source] ??= []).push(item);
  }

  if (grouped["Разное"]) {
    grouped["Разное"].sort((a, b) => miscRank(a.name) - miscRank(b.name));
  }

  return grouped;
}

function miscRank(name: string) {
  const index = MISC_ORDER.indexOf(name);
  return index === -1 ? MISC_ORDER.length : index;
}
