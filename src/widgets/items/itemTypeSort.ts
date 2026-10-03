import type { ItemTypeRow } from "@/actions/itemTypeAdmin";

export type SortKey = "name" | "price" | "source" | "show_in_buy" | "category";

const CATEGORY_LABELS: Record<string, string> = {
  Глайдеры: "Глайдер",
  Петы: "Пет",
  Другое: "Другое",
};

export function getCategoryLabel(category: string | null): string {
  return category ? (CATEGORY_LABELS[category] ?? category) : "-";
}

export function compareValues(
  a: string | number | null,
  b: string | number | null,
) {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b), "ru");
}

export type SortDir = "asc" | "desc";

const SORT_VALUES: Record<
  SortKey,
  (item: ItemTypeRow) => string | number | null
> = {
  name: (item) => item.name,
  price: (item) => item.price,
  source: (item) => item.source,
  show_in_buy: (item) => (item.show_in_buy ? 1 : 0),
  category: (item) => getCategoryLabel(item.category),
};

export function filterAndSortItems(
  items: ItemTypeRow[],
  search: string,
  sortKey: SortKey,
  sortDir: SortDir,
) {
  const query = search.trim().toLowerCase();
  const filtered = query
    ? items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          (item.source ?? "").toLowerCase().includes(query) ||
          getCategoryLabel(item.category).toLowerCase().includes(query),
      )
    : items;

  const value = SORT_VALUES[sortKey];
  return [...filtered].sort((a, b) => {
    const result = compareValues(value(a), value(b));
    return sortDir === "asc" ? result : -result;
  });
}
