import type { LootItem } from "../GuildLoot/LootTypes";
import { NON_STOCK_NAMES, toDate } from "./treasuryModel";

export const STALE_DAYS = 60;

const DAY_MS = 24 * 60 * 60 * 1000;

export type StockSort = "value" | "oldest" | "name";

export type StockLot = {
  id: number;
  quantity: number;
  source: string | null;
  acquiredAt: Date | null;
  unitPrice: number | null;
};

export type StockGroup = {
  itemTypeId: number;
  name: string;
  iconUrl: string | null;
  grade: number | null;
  sources: string[];
  quantity: number;
  unitPrice: number | null;
  value: number | null;
  isBundled: boolean;
  oldestAt: Date | null;
  ageDays: number | null;
  isStale: boolean;
  lots: StockLot[];
};

type StockDraft = Pick<
  StockGroup,
  "itemTypeId" | "name" | "iconUrl" | "grade" | "unitPrice"
> & {
  lots: StockLot[];
};

export function buildStockGroups(loot: LootItem[], now: Date): StockGroup[] {
  const drafts = new Map<number, StockDraft>();

  for (const item of loot) {
    if (item.status !== "В наличии" || item.quantity <= 0) continue;
    if (NON_STOCK_NAMES.has(item.itemType.name)) continue;

    const draft = drafts.get(item.itemType.id) ?? {
      itemTypeId: item.itemType.id,
      name: item.itemType.name,
      iconUrl: item.itemType.icon_url,
      grade: item.itemType.grade,
      unitPrice: item.itemType.price,
      lots: [],
    };
    draft.lots.push({
      id: item.id,
      quantity: item.quantity,
      source: item.source,
      acquiredAt: toDate(item.acquired_at),
      unitPrice: item.price ?? item.itemType.price,
    });
    drafts.set(item.itemType.id, draft);
  }

  return [...drafts.values()].map((draft) => finishGroup(draft, now));
}

export function sortStockGroups(groups: StockGroup[], sort: StockSort) {
  const byName = (a: StockGroup, b: StockGroup) =>
    a.name.localeCompare(b.name, "ru");

  return [...groups].sort((a, b) => {
    if (sort === "name") return byName(a, b);
    if (sort === "oldest") {
      return (b.ageDays ?? -1) - (a.ageDays ?? -1) || byName(a, b);
    }
    return (b.value ?? -1) - (a.value ?? -1) || byName(a, b);
  });
}

function finishGroup(draft: StockDraft, now: Date): StockGroup {
  const lots = [...draft.lots].sort(
    (a, b) => timeOf(a.acquiredAt) - timeOf(b.acquiredAt) || a.id - b.id,
  );
  const priced = lots.filter((lot) => lot.unitPrice !== null);
  const unitPrice = draft.unitPrice ?? priced[0]?.unitPrice ?? null;
  const oldestAt = lots[0]?.acquiredAt ?? null;
  const ageDays = oldestAt
    ? Math.max(0, Math.floor((now.getTime() - oldestAt.getTime()) / DAY_MS))
    : null;
  const sources = lots
    .map((lot) => lot.source?.trim())
    .filter((source): source is string => !!source);

  return {
    ...draft,
    lots,
    sources: [...new Set(sources)],
    quantity: lots.reduce((sum, lot) => sum + lot.quantity, 0),
    unitPrice,
    value: priced.length
      ? priced.reduce(
          (sum, lot) => sum + lot.quantity * (lot.unitPrice ?? 0),
          0,
        )
      : null,
    isBundled: unitPrice === null && draft.name.includes("Средоточие"),
    oldestAt,
    ageDays,
    isStale: ageDays !== null && ageDays > STALE_DAYS,
  };
}

function timeOf(date: Date | null) {
  return date ? date.getTime() : Number.MAX_SAFE_INTEGER;
}
