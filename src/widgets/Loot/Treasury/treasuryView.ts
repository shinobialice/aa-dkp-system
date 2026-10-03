import { sortStockGroups, type StockGroup, type StockSort } from "./stockModel";

export type TreasuryTab = "stock" | "journal" | "expenses";

export type StockView = { tab: TreasuryTab; search: string; sort: StockSort };

export function visibleStock(
  stock: StockGroup[],
  search: string,
  sort: StockSort,
) {
  const query = search.trim().toLowerCase();
  const found = query
    ? stock.filter((group) => group.name.toLowerCase().includes(query))
    : stock;
  return sortStockGroups(found, sort);
}
