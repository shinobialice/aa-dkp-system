import { getLootIconUrl } from "../widgets/Loot/LootBuy/icons/LootIcons";
import { sourceMap } from "../widgets/Loot/priceSourceMap";
import supabase from "@/shared/lib/supabase";

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
    { name: string; price: string | number | null; icon: string }[]
  > = {};

  for (const item of items) {
    const source = sourceMap[item.name] || "Разное";

    const displayPrice =
      item.name.includes("Средоточие") && item.price === null
        ? "Идут в комплекте"
        : item.price;

    const icon = getLootIconUrl(item.name);

    if (!grouped[source]) {
      grouped[source] = [];
    }

    grouped[source].push({
      name: item.name,
      price: displayPrice,
      icon,
    });
  }

  return grouped;
}
