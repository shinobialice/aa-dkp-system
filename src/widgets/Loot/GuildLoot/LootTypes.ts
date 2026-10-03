import type { getItemTypes, TreasuryLoot } from "@/actions/lootActions";

// Привязка к рейду имеет смысл только для праймовых боссов — у АГЛ нет
// смысла сопоставлять казну с конкретным заходом.
export const PRIME_LINKABLE_BOSSES = [
  "Кракен",
  "Калидис",
  "Анталлон",
  "Ксанатос",
  "Левиафан",
];

export function isPrimeLinkableSource(source: string | null | undefined) {
  return PRIME_LINKABLE_BOSSES.includes((source ?? "").trim());
}

export type LootItem = TreasuryLoot;

export type ItemType = Awaited<ReturnType<typeof getItemTypes>>[number];

export type NewLootItem = {
  itemTypeId: number;
  source: string;
  acquired_at: string;
  quantity: number;
  itemName: string;
  status?: string;
  sold_at?: string;
  price?: number;
  raidId?: number | null;
};
