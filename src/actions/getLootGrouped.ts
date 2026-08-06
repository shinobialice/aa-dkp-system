import { getLootIconUrl } from "../widgets/Loot/LootBuy/icons/LootIcons";
import { sourceMap } from "../widgets/Loot/priceSourceMap";
import supabase from "@/shared/lib/supabaseAdmin";

const HIDDEN_FROM_BUY = new Set([
  "Всякие мелочи",
  "Всякие мелочи 2",
  "В казну",
]);

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
  const { data: items, error } = await supabase
    .from("item_type")
    .select("name, price");

  if (error || !items) {
    console.error("Ошибка при загрузке предметов:", error);
    throw new Error("Не удалось получить список предметов");
  }

  const grouped: Record<
    string,
    { name: string; price: number | null; icon: string }[]
  > = {};

  for (const item of items) {
    if (HIDDEN_FROM_BUY.has(item.name)) continue;
    const source = sourceMap[item.name] || "Разное";
    const icon = getLootIconUrl(item.name);

    if (!grouped[source]) {
      grouped[source] = [];
    }

    grouped[source].push({
      name: item.name,
      price: item.price,
      icon,
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
