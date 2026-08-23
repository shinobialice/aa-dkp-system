import sql from "@/shared/lib/db";

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
  let items;
  try {
    items = await sql<any[]>`
      SELECT name, price, icon_url, grade, source, show_in_buy FROM item_type
    `;
  } catch (error) {
    console.error("Ошибка при загрузке предметов:", error);
    throw new Error("Не удалось получить список предметов");
  }

  const grouped: Record<
    string,
    {
      name: string;
      price: number | null;
      icon: string | null;
      grade: number | null;
    }[]
  > = {};

  for (const item of items) {
    if (!item.show_in_buy) continue;
    const source = item.source || "Разное";

    if (!grouped[source]) {
      grouped[source] = [];
    }

    grouped[source].push({
      name: item.name,
      price: item.price,
      icon: item.icon_url,
      grade: item.grade,
    });
  }

  if (grouped["Разное"]) {
    grouped["Разное"].sort((a, b) => {
      const ai = MISC_ORDER.indexOf(a.name);
      const bi = MISC_ORDER.indexOf(b.name);
      if (ai === -1 && bi === -1) return 0;
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
  }

  return grouped;
}
