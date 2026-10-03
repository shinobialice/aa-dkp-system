import type { MonthSalary } from "@/actions/financeActions";
import { CLASS_ORDER, classGroupTitle } from "@/shared/config/classes";
import { MONTH_NAMES } from "@/shared/config/months";
import type { GuildFundsRow } from "@/shared/lib/dbTypes";

export type Fund = GuildFundsRow;
export type SalaryEntry = MonthSalary;

export type SalarySortKey =
  | "class"
  | "username"
  | "attendance"
  | "weight"
  | "total"
  | "rest";

export type SalarySort = { key: SalarySortKey; desc: boolean };

export type SalaryGroup = {
  key: string;
  title: string;
  className: string | null;
  rows: SalaryEntry[];
};

export type SalaryModifier = {
  kind: "tenure" | "bonus" | "penalty";
  text: string;
};

export const DEFAULT_SORT: SalarySort = { key: "class", desc: false };

const DESC_FIRST: SalarySortKey[] = ["attendance", "weight", "total", "rest"];

export function monthLabel(month: number) {
  return MONTH_NAMES[month - 1].toLowerCase();
}

export function nextSort(current: SalarySort, key: SalarySortKey): SalarySort {
  if (current.key === key) return { key, desc: !current.desc };
  return { key, desc: DESC_FIRST.includes(key) };
}

export function remaining(row: SalaryEntry) {
  return row.total - row.sentAmount;
}

export function salaryModifiers(row: SalaryEntry): SalaryModifier[] {
  const modifiers: SalaryModifier[] = [];
  if (row.tenurePercent) {
    modifiers.push({
      kind: "tenure",
      text: `стаж +${Math.round(row.tenurePercent)}%`,
    });
  }
  if (row.customBonusPercent) {
    modifiers.push({
      kind: "bonus",
      text: `бонус +${Math.round(row.customBonusPercent)}%`,
    });
  }
  if (row.penaltyPercent) {
    modifiers.push({
      kind: "penalty",
      text: `штраф −${Math.round(row.penaltyPercent)}%`,
    });
  }
  return modifiers;
}

export function sortSalaries(rows: SalaryEntry[], sort: SalarySort) {
  const direction = sort.desc ? -1 : 1;
  return [...rows].sort((a, b) => {
    const left = sortValue(a, sort.key);
    const right = sortValue(b, sort.key);
    if (left === right) return joinedTime(a) - joinedTime(b);
    if (typeof left === "string" && typeof right === "string") {
      return left.localeCompare(right, "ru") * direction;
    }
    return (left < right ? -1 : 1) * direction;
  });
}

export function groupSalariesByClass(rows: SalaryEntry[]): SalaryGroup[] {
  const groups = new Map<string, SalaryGroup>();
  for (const row of rows) {
    const key = row.class ?? "none";
    const group = groups.get(key) ?? {
      key,
      title: classGroupTitle(row.class),
      className: row.class,
      rows: [],
    };
    group.rows.push(row);
    groups.set(key, group);
  }
  return [...groups.values()];
}

export function salaryPlace(rows: SalaryEntry[], row: SalaryEntry) {
  const ranked = [...rows].sort((a, b) => b.total - a.total);
  return ranked.findIndex((item) => item.id === row.id) + 1;
}

function sortValue(row: SalaryEntry, key: SalarySortKey): number | string {
  switch (key) {
    case "username":
      return row.username.toLowerCase();
    case "attendance":
      return row.totalPercent;
    case "weight":
      return row.weightPercent;
    case "total":
      return row.total;
    case "rest":
      return remaining(row);
    default:
      return classRank(row.class);
  }
}

function classRank(cls: string | null) {
  const index = cls ? CLASS_ORDER.indexOf(cls) : -1;
  return index === -1 ? CLASS_ORDER.length : index;
}

function joinedTime(row: SalaryEntry) {
  return row.joinedAt
    ? new Date(row.joinedAt).getTime()
    : Number.MAX_SAFE_INTEGER;
}
