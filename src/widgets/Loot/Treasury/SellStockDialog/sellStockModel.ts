import { plural } from "@/shared/lib/format";
import type { StockGroup } from "../stockModel";
import { formatShortDate } from "../treasuryModel";

export type SellMode = "sell" | "gift";

export type SellTarget = { group: StockGroup; mode: SellMode };

const FIFO_SHOWN = 3;

export function clampQuantity(value: number, max: number) {
  return Math.min(max, Math.max(1, Math.round(value) || 1));
}

export function quickPicks(max: number) {
  return [...new Set([1, 5, max])]
    .filter((value) => value <= max)
    .map((value) => ({
      value,
      label: value === max && max > 1 ? `Все ${max}` : String(value),
    }));
}

export function fifoSummary(group: StockGroup, quantity: number) {
  let left = quantity;
  const parts: string[] = [];
  for (const lot of group.lots) {
    if (left <= 0) break;
    const take = Math.min(lot.quantity, left);
    const date = lot.acquiredAt ? formatShortDate(lot.acquiredAt) : "без даты";
    parts.push(`${date} — ${take} шт.`);
    left -= take;
  }

  const rest = parts.length - FIFO_SHOWN;
  if (rest <= 0) return parts.join(", ");
  const shown = parts.slice(0, FIFO_SHOWN).join(", ");
  return `${shown} и ещё ${rest} ${plural(rest, "дроп", "дропа", "дропов")}`;
}
