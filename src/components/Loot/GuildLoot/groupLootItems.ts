import { LootItem, GroupedLootItem } from "./LootTypes";

export function groupLootItems(loot: LootItem[]): GroupedLootItem[] {
  const grouped = new Map<string, GroupedLootItem>();

  for (const item of loot) {
    const dateKey = item.sold_at?.toISOString().split("T")[0] || "";
    const key = `${item.itemTypeId}-${item.status}-${item.sold_to ?? ""}-${
      item.source ?? ""
    }-${dateKey}`;

    if (!grouped.has(key)) {
      grouped.set(key, {
        id: item.itemTypeId * 1000 + Math.floor(Math.random() * 1000),
        itemTypeId: item.itemTypeId,
        name: item.itemType.name,
        total: item.quantity ?? 1,
        status: item.status ?? "Неизвестно",
        source: item.source,
        acquired_at: item.acquired_at,
        latest_sold_at: item.sold_at,
        price: item.price,
        sold:
          item.status === "Продано" || item.status === "Выдано"
            ? item.quantity ?? 1
            : 0,
        sold_to: new Set(item.sold_to ? [item.sold_to] : []),
        comments: new Set(item.comment ? [item.comment] : []),
      });
    } else {
      const group = grouped.get(key)!;
      group.total += item.quantity ?? 1;
      group.sold +=
        item.status === "Продано" || item.status === "Выдано"
          ? item.quantity ?? 1
          : 0;
      group.sold_to.add(item.sold_to ?? "");
      if (item.comment) group.comments.add(item.comment);

      if (
        item.sold_at &&
        (!group.latest_sold_at || item.sold_at > group.latest_sold_at)
      ) {
        group.latest_sold_at = item.sold_at;
      }
    }
  }

  return Array.from(grouped.values());
}
