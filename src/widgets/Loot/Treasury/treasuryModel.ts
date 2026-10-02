import {
  MISC_LOOT_ITEM_NAMES,
  type LootItem,
} from "@/widgets/Loot/GuildLoot/LootTypes";
import type { ExpenseItem } from "@/widgets/Loot/GuildLoot/ExpensesTypes";
import { UTILITY_ITEM_NAMES } from "@/shared/config/lootUtilityItems";

export const STALE_DAYS = 60;

const DAY_MS = 24 * 60 * 60 * 1000;
const NON_STOCK_NAMES = new Set([...MISC_LOOT_ITEM_NAMES, ...UTILITY_ITEM_NAMES]);

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

export type JournalKind = "drop" | "sale" | "gift" | "treasury";

export type JournalEntry = {
  key: string;
  kind: JournalKind;
  at: Date;
  title: string;
  quantity: number;
  showQuantity: boolean;
  iconName: string;
  iconUrl: string | null;
  grade: number | null;
  source: string | null;
  recipient: string | null;
  recipientId: number | null;
  comment: string | null;
  amount: number;
  records: LootItem[];
};

export type JournalDay = {
  key: string;
  label: string;
  entries: JournalEntry[];
};

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
  staleCount: number;
};

export function formatGold(value: number) {
  return value.toLocaleString("ru-RU");
}

export function plural(n: number, one: string, few: string, many: string) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

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

function toDate(value: Date | string | null | undefined) {
  return value ? new Date(value) : null;
}

function timeOf(date: Date | null) {
  return date ? date.getTime() : Number.MAX_SAFE_INTEGER;
}

export function isInUtcMonth(
  value: Date | string | null | undefined,
  month: number,
  year: number,
) {
  const date = toDate(value);
  return (
    !!date && date.getUTCFullYear() === year && date.getUTCMonth() + 1 === month
  );
}

function localDayKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}

function dayLabel(date: Date) {
  const day = date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
  });
  const weekday = date.toLocaleDateString("ru-RU", { weekday: "short" });
  return `${day}, ${weekday}`;
}

export function buildStockGroups(loot: LootItem[], now: Date): StockGroup[] {
  const groups = new Map<number, StockGroup>();

  for (const item of loot) {
    const quantity = item.quantity ?? 0;
    if (item.status !== "В наличии" || quantity <= 0) continue;
    if (NON_STOCK_NAMES.has(item.itemType.name)) continue;

    let group = groups.get(item.itemType.id);
    if (!group) {
      group = {
        itemTypeId: item.itemType.id,
        name: item.itemType.name,
        iconUrl: item.itemType.icon_url,
        grade: item.itemType.grade,
        sources: [],
        quantity: 0,
        unitPrice: item.itemType.price ?? null,
        value: null,
        isBundled: false,
        oldestAt: null,
        ageDays: null,
        isStale: false,
        lots: [],
      };
      groups.set(item.itemType.id, group);
    }

    group.lots.push({
      id: item.id,
      quantity,
      source: item.source,
      acquiredAt: toDate(item.acquired_at),
      unitPrice: item.price ?? item.itemType.price ?? null,
    });
  }

  return [...groups.values()].map((group) => {
    const lots = [...group.lots].sort(
      (a, b) => timeOf(a.acquiredAt) - timeOf(b.acquiredAt) || a.id - b.id,
    );
    const priced = lots.filter((lot) => lot.unitPrice !== null);
    const unitPrice = group.unitPrice ?? priced[0]?.unitPrice ?? null;
    const oldestAt = lots[0]?.acquiredAt ?? null;
    const ageDays = oldestAt
      ? Math.max(0, Math.floor((now.getTime() - oldestAt.getTime()) / DAY_MS))
      : null;

    return {
      ...group,
      lots,
      sources: [
        ...new Set(lots.map((lot) => lot.source?.trim()).filter(Boolean)),
      ] as string[],
      quantity: lots.reduce((sum, lot) => sum + lot.quantity, 0),
      unitPrice,
      value: priced.length
        ? priced.reduce((sum, lot) => sum + lot.quantity * (lot.unitPrice ?? 0), 0)
        : null,
      isBundled: unitPrice === null && group.name.includes("Средоточие"),
      oldestAt,
      ageDays,
      isStale: ageDays !== null && ageDays > STALE_DAYS,
    };
  });
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
  let salesTotal = 0;
  let treasuryTotal = 0;
  let treasuryCount = 0;
  let lastTreasury: MonthStats["lastTreasury"] = null;

  for (const item of loot) {
    if (!isInUtcMonth(item.sold_at, month, year)) continue;
    if (item.status === "Продано") {
      salesTotal += item.price ?? 0;
    }
    if (item.status === "В казну") {
      treasuryTotal += item.price ?? 0;
      treasuryCount += 1;
      const at = new Date(item.sold_at as Date);
      if (!lastTreasury || at > lastTreasury.at) {
        lastTreasury = { source: item.source, at };
      }
    }
  }

  const monthExpenses = expensesForMonth(expenses, month, year);
  const topExpense = monthExpenses.reduce<ExpenseItem | null>(
    (best, expense) => (!best || expense.amount > best.amount ? expense : best),
    null,
  );
  const miscTotal = misc.reduce((sum, item) => sum + item.amount, 0);

  return {
    salesTotal,
    miscTotal,
    income: salesTotal + miscTotal,
    treasuryTotal,
    treasuryCount,
    lastTreasury,
    expensesTotal: monthExpenses.reduce((sum, item) => sum + item.amount, 0),
    expensesCount: monthExpenses.length,
    topExpense: topExpense
      ? { target: topExpense.target, amount: topExpense.amount }
      : null,
    stockValue: stock.reduce((sum, group) => sum + (group.value ?? 0), 0),
    stockQuantity: stock.reduce((sum, group) => sum + group.quantity, 0),
    stockPositions: stock.length,
    staleCount: stock.filter((group) => group.isStale).length,
  };
}

export function expensesForMonth(
  expenses: ExpenseItem[],
  month: number,
  year: number,
) {
  return expenses
    .filter((expense) => isInUtcMonth(expense.date, month, year))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

const KIND_ORDER: Record<JournalKind, number> = {
  treasury: 0,
  sale: 1,
  gift: 2,
  drop: 3,
};

function entryTitle(records: LootItem[]) {
  const byName = new Map<string, number>();
  for (const record of records) {
    const name = record.itemType.name;
    byName.set(name, (byName.get(name) ?? 0) + (record.quantity ?? 0));
  }
  if (byName.size === 1) return [...byName.keys()][0];
  return [...byName.entries()]
    .map(([name, quantity]) => (quantity > 1 ? `${name} ×${quantity}` : name))
    .join(", ");
}

export function buildJournal(
  loot: LootItem[],
  month: number,
  year: number,
): JournalDay[] {
  const groups = new Map<
    string,
    { kind: JournalKind; at: Date; records: LootItem[] }
  >();

  const add = (kind: JournalKind, at: Date, record: LootItem, key: string) => {
    const fullKey = `${localDayKey(at)}|${kind}|${key}`;
    const group = groups.get(fullKey);
    if (group) {
      group.records.push(record);
      if (at > group.at) group.at = at;
      return;
    }
    groups.set(fullKey, { kind, at, records: [record] });
  };

  for (const item of loot) {
    const acquired = toDate(item.acquired_at);
    const sold = toDate(item.sold_at);

    if (item.status === "В казну") {
      if (sold && isInUtcMonth(sold, month, year)) {
        add("treasury", sold, item, String(item.id));
      }
      continue;
    }
    if (item.status === "Распродано" || NON_STOCK_NAMES.has(item.itemType.name)) {
      continue;
    }

    const isOut = item.status === "Продано" || item.status === "Выдано";
    if (isOut && sold && isInUtcMonth(sold, month, year)) {
      const recipient = `${item.sold_to_user_id ?? ""}:${item.sold_to ?? ""}`;
      const comment = item.comment ?? "";
      if (item.status === "Продано") {
        add("sale", sold, item, `${item.itemType.id}|${recipient}|${comment}`);
      } else {
        add("gift", sold, item, `${recipient}|${comment}`);
      }
    }

    const soldSameDay =
      isOut && !!acquired && !!sold && localDayKey(acquired) === localDayKey(sold);
    if (acquired && isInUtcMonth(acquired, month, year) && !soldSameDay) {
      add("drop", acquired, item, `${item.itemType.id}|${item.source ?? ""}`);
    }
  }

  const days = new Map<string, { at: Date; entries: JournalEntry[] }>();

  for (const [key, group] of groups) {
    const first = group.records[0];
    const quantity = group.records.reduce((sum, r) => sum + (r.quantity ?? 0), 0);
    const title =
      group.kind === "treasury" ? "Поступление в казну" : entryTitle(group.records);
    const sources = [
      ...new Set(group.records.map((r) => r.source?.trim()).filter(Boolean)),
    ];

    const entry: JournalEntry = {
      key,
      kind: group.kind,
      at: group.at,
      title,
      quantity,
      showQuantity:
        group.kind !== "treasury" && quantity > 1 && !title.includes("×"),
      iconName: first.itemType.name,
      iconUrl: first.itemType.icon_url,
      grade: first.itemType.grade,
      source: sources.length ? sources.join(", ") : null,
      recipient:
        group.kind === "sale" || group.kind === "gift" ? first.sold_to : null,
      recipientId:
        group.kind === "sale" || group.kind === "gift"
          ? (first.sold_to_user_id ?? null)
          : null,
      comment: group.kind === "drop" ? null : first.comment,
      amount:
        group.kind === "sale" || group.kind === "treasury"
          ? group.records.reduce((sum, r) => sum + (r.price ?? 0), 0)
          : 0,
      records: group.records,
    };

    const dayKey = localDayKey(group.at);
    const day = days.get(dayKey);
    if (day) {
      day.entries.push(entry);
      if (group.at > day.at) day.at = group.at;
    } else {
      days.set(dayKey, { at: group.at, entries: [entry] });
    }
  }

  return [...days.entries()]
    .sort(([, a], [, b]) => b.at.getTime() - a.at.getTime())
    .map(([key, day]) => ({
      key,
      label: dayLabel(day.at),
      entries: day.entries.sort(
        (a, b) =>
          b.at.getTime() - a.at.getTime() || KIND_ORDER[a.kind] - KIND_ORDER[b.kind],
      ),
    }));
}

export function buildBossSales(
  loot: LootItem[],
  month: number,
  year: number,
): BossSales[] {
  const totals = new Map<string, number>();
  for (const item of loot) {
    if (item.status !== "Продано" || !isInUtcMonth(item.sold_at, month, year)) {
      continue;
    }
    const name = item.source?.trim() || "Без источника";
    totals.set(name, (totals.get(name) ?? 0) + (item.price ?? 0));
  }
  return [...totals.entries()]
    .map(([name, total]) => ({ name, total }))
    .sort((a, b) => b.total - a.total);
}
