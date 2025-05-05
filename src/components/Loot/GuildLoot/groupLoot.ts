import { GroupedLootItem, LootItem } from "./LootTypes";

export function groupLoot(
  loot: LootItem[],
  month: number,
  year: number
): GroupedLootItem[] {
  const filteredLoot = loot.filter((item) => {
    if (item.status === "В наличии" || item.status === "Продаётся") return true;
    if (!item.sold_at) return false;

    const soldDate = new Date(item.sold_at);
    return soldDate.getMonth() + 1 === month && soldDate.getFullYear() === year;
  });

  return Object.values(
    filteredLoot.reduce((acc, item) => {
      const key = `${item.itemTypeId}-${item.status}`;
      if (!acc[key]) {
        acc[key] = {
          itemTypeId: item.itemTypeId,
          name: item.itemType.name,
          price: item.itemType.price,
          source: item.source,
          acquired_at: item.acquired_at,
          total: 0,
          sold: 0,
          latest_sold_at: null,
          sold_to: new Set(),
          comments: new Set(),
          status: item.status,
        };
      }

      acc[key].total += item.quantity ?? 1;
      if (item.status === "Продано") {
        acc[key].sold++;
        if (
          item.sold_at &&
          (!acc[key].latest_sold_at || item.sold_at > acc[key].latest_sold_at)
        ) {
          acc[key].latest_sold_at = item.sold_at;
        }
      }
      if (item.sold_to) acc[key].sold_to.add(item.sold_to);
      if (item.comment) acc[key].comments.add(item.comment);
      return acc;
    }, {} as Record<string, GroupedLootItem>)
  );
}
