import {
  ArrowDownLeft,
  ArrowUpRight,
  Gift,
  Landmark,
  type LucideIcon,
} from "lucide-react";
import type { LootItem } from "../../GuildLoot/LootTypes";
import type { JournalKind } from "../journalModel";

export type JournalFilter = "all" | JournalKind;

export type RecordActions = {
  onEditRecord: (record: LootItem) => void;
  onDeleteRecord: (record: LootItem, kind: JournalKind) => void;
};

export const KIND_META: Record<
  JournalKind,
  { label: string; icon: LucideIcon; chip: string; dot: string }
> = {
  drop: {
    label: "Получено",
    icon: ArrowDownLeft,
    chip: "bg-blue-50 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
    dot: "bg-blue-500",
  },
  sale: {
    label: "Продано",
    icon: ArrowUpRight,
    chip: "bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-300",
    dot: "bg-green-600",
  },
  gift: {
    label: "Выдано",
    icon: Gift,
    chip: "bg-violet-50 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300",
    dot: "bg-violet-500",
  },
  treasury: {
    label: "В казну",
    icon: Landmark,
    chip: "bg-orange-50 text-orange-700 dark:bg-orange-500/15 dark:text-orange-300",
    dot: "bg-orange-500",
  },
};

export const FILTERS: JournalFilter[] = [
  "all",
  "drop",
  "sale",
  "gift",
  "treasury",
];

export function isIncome(kind: JournalKind) {
  return kind === "sale" || kind === "treasury";
}
