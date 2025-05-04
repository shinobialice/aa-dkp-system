import { PrismaClient } from "@prisma/client";
import { sourceMap } from "../components/Loot/priceSourceMap";
import { getLootIconUrl } from "../components/Loot/LootBuy/icons/LootIcons";

const prisma = new PrismaClient();

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

    if (!grouped[source]) grouped[source] = [];

    grouped[source].push({
      name: item.name,
      price: displayPrice,
      icon,
    });
  }

  return grouped;
}
