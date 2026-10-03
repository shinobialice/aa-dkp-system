import type { InventoryItem } from "@/actions/getUserInventory";

export type CatalogItem = {
  type: string;
  name: string;
  label?: string;
  iconUrl?: string | null;
};

export const INVENTORY_CATEGORIES = ["Техника", "Глайдеры", "Петы", "Другое"];

// В этих категориях предметы добавляются поиском по каталогу.
export const CATALOG_CATEGORIES = ["Глайдеры", "Петы", "Другое"];

export type SelectorKind = "bafalka" | "tier" | "dragon" | "presence";

type QualityKind = Extract<SelectorKind, "bafalka" | "tier">;

export const DRAGON_ITEM = "Дракон";
export const DRAGONS = ["Красный Дракон", "Черный Дракон", "Зеленый Дракон"];

const T2_BY_BASE: Record<string, string> = {
  "Коллеционный глайдер": "Коллеционный глайдер т2",
  "Коллекционный фамильяр": "Коллекционный фамильяр т2",
  "Коллекционный пет": "Коллекционный пет т2",
};
const T2_ITEMS = new Set(Object.values(T2_BY_BASE));

const QUALITY_LABELS: Record<QualityKind, Record<string, string>> = {
  bafalka: { "3": "3 эпоха", "4": "4 эпоха", "5": "5 эпоха" },
  tier: { "3": "T1", "4": "T2" },
};

export const NONE = "Нет";
export const PRESENT = "Есть";

export const SELECTOR_OPTIONS: Record<SelectorKind, string[]> = {
  bafalka: [NONE, ...Object.values(QUALITY_LABELS.bafalka)],
  tier: [NONE, ...Object.values(QUALITY_LABELS.tier)],
  dragon: [NONE, ...DRAGONS],
  presence: [PRESENT, NONE],
};

export function selectorKind(name: string): SelectorKind {
  if (name === "Бафалка") return "bafalka";
  if (name === DRAGON_ITEM) return "dragon";
  if (name in T2_BY_BASE || T2_ITEMS.has(name)) return "tier";
  return "presence";
}

export function selectorValue(kind: SelectorKind, userItem?: InventoryItem) {
  if (!userItem) return NONE;
  if (kind === "presence") return PRESENT;
  if (kind === "dragon") return userItem.name ?? NONE;
  return QUALITY_LABELS[kind][userItem.quality ?? ""] ?? NONE;
}

export function qualityForValue(kind: QualityKind, value: string) {
  const entry = Object.entries(QUALITY_LABELS[kind]).find(
    ([, label]) => label === value,
  );
  return entry?.[0] ?? null;
}

export function findUserItem(item: CatalogItem, inventory: InventoryItem[]) {
  if (item.name === DRAGON_ITEM) {
    return inventory.find(
      (owned) => owned.type === item.type && DRAGONS.includes(owned.name ?? ""),
    );
  }
  return inventory.find(
    (owned) => owned.name === item.name && owned.type === item.type,
  );
}

// Цветные драконы показываются внутри карточки "Дракон", а T1 и T2 одной
// вещи никогда не видны одновременно.
export function isShownInGrid(item: CatalogItem, inventory: InventoryItem[]) {
  if (DRAGONS.includes(item.name)) return false;
  const owns = (name: string) => inventory.some((owned) => owned.name === name);
  const t2 = T2_BY_BASE[item.name];
  if (t2) return !owns(t2);
  if (T2_ITEMS.has(item.name)) return owns(item.name);
  return true;
}
