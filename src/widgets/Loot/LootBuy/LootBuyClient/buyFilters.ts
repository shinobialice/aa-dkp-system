import type { ItemGroup, MyPlace } from "../LootItemList";
import type { BuyItem, QueueMap } from "../lootBuyModel";

export type BuyFilters = {
  source: string | null;
  inStockOnly: boolean;
  search: string;
};

export function findMyPlaces(queues: QueueMap, userId: number | null) {
  const places: Record<string, MyPlace> = {};
  if (userId === null) return places;
  for (const [name, entries] of Object.entries(queues)) {
    const index = entries.findIndex((entry) => entry.userId === userId);
    if (index >= 0) places[name] = { place: index + 1, total: entries.length };
  }
  return places;
}

export function groupItems(
  items: BuyItem[],
  sources: string[],
  filters: BuyFilters,
): ItemGroup[] {
  const term = filters.search.trim().toLowerCase();
  const matches = (item: BuyItem) =>
    (!filters.inStockOnly || item.stock > 0) &&
    (!term || item.name.toLowerCase().includes(term));

  return sources
    .filter((name) => filters.source === null || name === filters.source)
    .map((name) => ({
      source: name,
      items: items.filter((item) => item.source === name && matches(item)),
    }))
    .filter((group) => group.items.length > 0);
}

export function defaultItemName(
  items: BuyItem[],
  queues: QueueMap,
  myItems: BuyItem[],
) {
  const withQueue = items.find((item) => (queues[item.name]?.length ?? 0) > 0);
  return myItems[0]?.name ?? withQueue?.name ?? items[0]?.name ?? null;
}
