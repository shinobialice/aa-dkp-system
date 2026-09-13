import type { UserEquipment } from "@/actions/getUserEquipment";
import { findGearItem, findGearItemById, ITEMS_BY_SLOT } from "./itemsData";
import { NAMED_SETS, type NamedSet, type NamedSetTier } from "./itemsData/namedSets";
import { BASE_CHARACTER_STATS, computeEquippedBonuses } from "./characterStats";

const ARMOR_SLOT_ORDER = [
  "head",
  "chest",
  "belt",
  "bracers",
  "hands",
  "legs",
  "feet",
] as const;

export type NamedSetPiece = {
  itemId: number;
  name: string;
  iconUrl: string;
  owned: boolean;
};

export type NamedSetTierStatus = {
  count: number;
  text: string;
  active: boolean;
};

export type ActiveNamedSet = {
  id: number;
  name: string;
  ownedCount: number;
  totalCount: number;
  pieceRows: NamedSetPiece[][];
  tiers: NamedSetTierStatus[];
};

function getEquippedItemIds(equipment: UserEquipment[]): Set<number> {
  const ids = new Set<number>();
  for (const eq of equipment) {
    const item = findGearItem(eq.slot, eq.item_name);
    if (item) ids.add(item.id);
  }
  return ids;
}

function findArmorSlot(itemId: number): string | undefined {
  return ARMOR_SLOT_ORDER.find((slot) =>
    ITEMS_BY_SLOT[slot]?.some((i) => i.id === itemId),
  );
}

function groupIntoRows(pieces: NamedSetPiece[]): NamedSetPiece[][] {
  const slots = pieces.map((p) => findArmorSlot(p.itemId));
  if (slots.some((s) => !s)) return [pieces];

  const rows: NamedSetPiece[][] = [];
  for (let i = 0; i < pieces.length; i += 7) {
    const row = pieces.slice(i, i + 7);
    row.sort(
      (a, b) =>
        ARMOR_SLOT_ORDER.indexOf(
          findArmorSlot(a.itemId) as (typeof ARMOR_SLOT_ORDER)[number],
        ) -
        ARMOR_SLOT_ORDER.indexOf(
          findArmorSlot(b.itemId) as (typeof ARMOR_SLOT_ORDER)[number],
        ),
    );
    rows.push(row);
  }
  return rows;
}

function resolveTierText(tier: NamedSetTier, equipment: UserEquipment[]): string {
  if (!tier.dynamic) return tier.text;
  const bonus = computeEquippedBonuses(equipment);
  const total = BASE_CHARACTER_STATS[tier.dynamic.stat] + bonus[tier.dynamic.stat];
  const value = Math.round(total * tier.dynamic.coefficient);
  return tier.text.replace("{{value}}", String(value));
}

function buildActiveNamedSet(
  set: NamedSet,
  equippedIds: Set<number>,
  equipment: UserEquipment[],
): ActiveNamedSet {
  const pieces: NamedSetPiece[] = set.itemIds.map((id) => {
    const gearItem = findGearItemById(id);
    return {
      itemId: id,
      name: gearItem?.name ?? "",
      iconUrl: gearItem?.iconUrl ?? "",
      owned: equippedIds.has(id),
    };
  });
  const ownedCount = pieces.filter((p) => p.owned).length;
  const tiers = set.tiers.map((t) => ({
    count: t.count,
    text: resolveTierText(t, equipment),
    active: ownedCount >= t.count,
  }));
  return {
    id: set.id,
    name: set.name,
    ownedCount,
    totalCount: pieces.length,
    pieceRows: groupIntoRows(pieces),
    tiers,
  };
}

export function getNamedSetForItem(
  itemId: number,
  equipment: UserEquipment[],
): ActiveNamedSet | null {
  const set = NAMED_SETS.find((s) => s.itemIds.includes(itemId));
  if (!set) return null;
  return buildActiveNamedSet(set, getEquippedItemIds(equipment), equipment);
}
