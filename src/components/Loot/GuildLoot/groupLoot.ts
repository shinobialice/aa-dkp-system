import { GroupedLootItem, LootItem } from "./LootTypes";

export function groupLoot(
  loot: LootItem[],
  month: number,
  year: number
): GroupedLootItem[] {
  const result: GroupedLootItem[] = [];

  for (const item of loot) {
    const date = item.status === "Продано" ? item.sold_at : item.acquired_at;

    if (!date) continue;

    const d = new Date(date);
    if (d.getMonth() + 1 !== month || d.getFullYear() !== year) continue;

    if (item.status === "Продано") {
      result.push({
        itemTypeId: item.itemTypeId,
        name: item.itemType.name,
        price: item.itemType.price,
        source: item.source,
        acquired_at: item.acquired_at,
        total: item.quantity ?? 1,
        sold: item.quantity ?? 1,
        latest_sold_at: item.sold_at,
        sold_to: new Set(item.sold_to ? [item.sold_to] : []),
        comments: new Set(item.comment ? [item.comment] : []),
        status: "Продано",
      });
    } else {
      const key = `${item.itemTypeId}-${item.status}`;
      let existing = result.find((r) => `${r.itemTypeId}-${r.status}` === key);
      if (!existing) {
        existing = {
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
        result.push(existing);
      }

      existing.total += item.quantity ?? 1;
      if (item.comment) existing.comments.add(item.comment);
    }
  }

  return result;
}
