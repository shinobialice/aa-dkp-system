export const MISC_LOOT_ITEM_NAMES = [
  "Эссенции акхиума",
  "Всякие мелочи",
  "Всякие мелочи 2",
];

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

export type LootItem = {
  sold_to_user_id?: number | null;
  id: number;
  status: string | null;
  source: string | null;
  created_at: Date;
  itemTypeId: number;
  sold_at: Date | null;
  sold_to: string | null;
  comment: string | null;
  acquired_at: Date | null;
  quantity?: number;
  price: number | null;
  raid_id?: number | null;
  itemType: {
    id: number;
    name: string;
    price: number | null;
    icon_url: string | null;
    grade: number | null;
  };
};

export type GroupedLootItem = {
  id: number;
  itemTypeId: number;
  name: string;
  price: number | null;
  source: string | null;
  acquired_at: Date | null;
  total: number;
  sold: number;
  latest_sold_at: Date | null;
  sold_to: Set<string>;
  comments: Set<string>;
  status: string;
};

export type ItemType = {
  id: number;
  name: string;
  icon_url?: string | null;
  grade?: number | null;
};

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
