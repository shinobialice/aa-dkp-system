import { UTILITY_ITEM_NAMES } from "@/shared/config/lootUtilityItems";
import type { ExpenseItem } from "../GuildLoot/ExpensesTypes";
import { MISC_LOOT_ITEM_NAMES } from "@/shared/config/miscLoot";
import type { LootItem } from "../GuildLoot/LootTypes";
import type { StockGroup } from "./stockModel";

export const NON_STOCK_NAMES = new Set([
  ...MISC_LOOT_ITEM_NAMES,
  ...UTILITY_ITEM_NAMES,
]);

export type BossSales = { name: string; total: number };

export type MiscTotal = { name: string; amount: number };

export type MonthStats = {
  salesTotal: number;
  miscTotal: number;
  income: number;
  treasuryTotal: number;
  treasuryCount: number;
  lastTreasury: { source: string | null; at: Date } | null;
  expensesTotal: number;
  expensesCount: number;
  topExpense: { target: string; amount: number } | null;
  stockValue: number;
  stockQuantity: number;
  stockPositions: number;
};

export function monthName(month: number) {
  return new Date(2000, month - 1, 1).toLocaleString("ru-RU", {
    month: "long",
  });
}

export function formatShortDate(date: Date) {
  return date.toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit" });
}

export function formatDate(date: Date) {
  return date.toLocaleDateString("ru-RU");
}

export function toDate(value: string | null | undefined) {
  return value ? new Date(value) : null;
}

export function isInUtcMonth(date: Date | null, month: number, year: number) {
  return (
    !!date && date.getUTCFullYear() === year && date.getUTCMonth() + 1 === month
  );
}

export function buildMonthStats({
  loot,
  expenses,
  misc,
  stock,
  month,
  year,
}: {
  loot: LootItem[];
  expenses: ExpenseItem[];
  misc: MiscTotal[];
  stock: StockGroup[];
  month: number;
  year: number;
}): MonthStats {
  const soldThisMonth = loot.filter((item) =>
    isInUtcMonth(toDate(item.sold_at), month, year),
  );
  const salesTotal = sumPrices(
    soldThisMonth.filter((item) => item.status === "Продано"),
  );
  const treasury = soldThisMonth.filter((item) => item.status === "В казну");
  const monthExpenses = expensesForMonth(expenses, month, year);
  const miscTotal = misc.reduce((sum, item) => sum + item.amount, 0);

  return {
    salesTotal,
    miscTotal,
    income: salesTotal + miscTotal,
    treasuryTotal: sumPrices(treasury),
    treasuryCount: treasury.length,
    lastTreasury: latestTreasury(treasury),
    expensesTotal: monthExpenses.reduce((sum, item) => sum + item.amount, 0),
    expensesCount: monthExpenses.length,
    topExpense: largestExpense(monthExpenses),
    stockValue: stock.reduce((sum, group) => sum + (group.value ?? 0), 0),
    stockQuantity: stock.reduce((sum, group) => sum + group.quantity, 0),
    stockPositions: stock.length,
  };
}

export function expensesForMonth(
  expenses: ExpenseItem[],
  month: number,
  year: number,
) {
  return expenses
    .filter((expense) => isInUtcMonth(new Date(expense.date), month, year))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function buildBossSales(
  loot: LootItem[],
  month: number,
  year: number,
): BossSales[] {
  const totals = new Map<string, number>();
  for (const item of loot) {
    if (item.status !== "Продано") continue;
    if (!isInUtcMonth(toDate(item.sold_at), month, year)) continue;
    const name = item.source?.trim() || "Без источника";
    totals.set(name, (totals.get(name) ?? 0) + (item.price ?? 0));
  }
  return [...totals.entries()]
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total);
}

function sumPrices(items: LootItem[]) {
  return items.reduce((sum, item) => sum + (item.price ?? 0), 0);
}

function latestTreasury(items: LootItem[]): MonthStats["lastTreasury"] {
  let latest: MonthStats["lastTreasury"] = null;
  for (const item of items) {
    const at = toDate(item.sold_at);
    if (at && (!latest || at > latest.at)) latest = { source: item.source, at };
  }
  return latest;
}

function largestExpense(expenses: ExpenseItem[]): MonthStats["topExpense"] {
  const top = expenses.reduce<ExpenseItem | null>(
    (best, expense) => (!best || expense.amount > best.amount ? expense : best),
    null,
  );
  return top ? { target: top.target, amount: top.amount } : null;
}
