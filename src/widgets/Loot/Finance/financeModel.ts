import { CLASS_ORDER } from "@/widgets/MembersTable/membersModel";

export type Fund = {
  totalIncome: number;
  totalExpenses: number;
  profit: number;
  salaryBudget: number;
  treasuryBudget: number;
  inTreasury: number;
  advanceSent: number;
  carryOver: number;
};

export type SalaryRow = {
  id: number;
  userId: number;
  username: string;
  class: string | null;
  avatarUrl: string | null;
  joinedAt: string | null;
  amount: number;
  bonus: number | null;
  total: number;
  sentAmount: number;
  sent: boolean;
  tenurePercent: number;
  customBonusPercent: number;
  penaltyPercent: number;
  weightPercent: number;
  aglPercent: number;
  primePercent: number;
  totalPercent: number;
};

export type SalarySortKey =
  | "class"
  | "username"
  | "attendance"
  | "weight"
  | "total"
  | "rest";

export type SalarySort = { key: SalarySortKey; desc: boolean };

export const DESC_FIRST: SalarySortKey[] = [
  "attendance",
  "weight",
  "total",
  "rest",
];

export type SalaryGroup = {
  key: string;
  title: string;
  className: string | null;
  rows: SalaryRow[];
};

const CLASS_PLURAL: Record<string, string> = {
  Бард: "Барды",
  Лук: "Луки",
  Стрелок: "Стрелки",
  Маг: "Маги",
  Милик: "Милики",
  Тактик: "Тактики",
  Танцор: "Танцоры",
  Хил: "Хилы",
};

export const MONTHS = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

export const MONTHS_GENITIVE = [
  "январь",
  "февраль",
  "март",
  "апрель",
  "май",
  "июнь",
  "июль",
  "август",
  "сентябрь",
  "октябрь",
  "ноябрь",
  "декабрь",
];

export function formatGold(value: number): string {
  return Math.round(value).toLocaleString("ru-RU");
}

export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

function classRank(cls: string | null): number {
  const index = cls ? CLASS_ORDER.indexOf(cls) : -1;
  return index === -1 ? CLASS_ORDER.length : index;
}

function joinedTime(row: SalaryRow): number {
  return row.joinedAt
    ? new Date(row.joinedAt).getTime()
    : Number.MAX_SAFE_INTEGER;
}

function sortValue(row: SalaryRow, key: SalarySortKey): number | string {
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
      return row.total - row.sentAmount;
    default:
      return classRank(row.class);
  }
}

export function sortSalaries(rows: SalaryRow[], sort: SalarySort): SalaryRow[] {
  const direction = sort.desc ? -1 : 1;
  return [...rows].sort((a, b) => {
    const left = sortValue(a, sort.key);
    const right = sortValue(b, sort.key);
    if (left !== right) {
      if (typeof left === "string" && typeof right === "string") {
        return left.localeCompare(right, "ru") * direction;
      }
      return (left < right ? -1 : 1) * direction;
    }
    return joinedTime(a) - joinedTime(b);
  });
}

export function groupSalariesByClass(rows: SalaryRow[]): SalaryGroup[] {
  const groups = new Map<string, SalaryGroup>();
  for (const row of rows) {
    const key = row.class ?? "none";
    const group = groups.get(key) ?? {
      key,
      title: row.class ? (CLASS_PLURAL[row.class] ?? row.class) : "Без класса",
      className: row.class,
      rows: [],
    };
    group.rows.push(row);
    groups.set(key, group);
  }
  return Array.from(groups.values());
}

export function attendanceTone(percent: number) {
  if (percent >= 80)
    return { text: "text-green-700 dark:text-green-400", bar: "bg-green-600" };
  if (percent >= 50)
    return { text: "text-amber-700 dark:text-amber-400", bar: "bg-amber-500" };
  return { text: "text-red-700 dark:text-red-400", bar: "bg-red-500" };
}

export function shiftMonth(month: number, year: number, delta: number) {
  const index = year * 12 + (month - 1) + delta;
  return { month: (index % 12) + 1, year: Math.floor(index / 12) };
}
