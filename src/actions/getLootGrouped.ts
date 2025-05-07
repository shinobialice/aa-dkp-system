import { getLootIconUrl } from "../components/Loot/LootBuy/icons/LootIcons";
import { sourceMap } from "../components/Loot/priceSourceMap";
import prisma from "@/lib/db";

export async function getLootGrouped() {
  const items = await prisma.itemType.findMany();

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

    if (!grouped[source]) {grouped[source] = [];}

    grouped[source].push({
      name: item.name,
      price: displayPrice,
      icon,
    });
  }

  return grouped;
}
