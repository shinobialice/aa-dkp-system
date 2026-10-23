import type { HealcountRecord } from "@/server/healcount";
import type { KillcountFighter } from "@/server/killcountEntries/types";
import { formatNumber } from "@/shared/lib/format";
import {
  totalHonor,
  type SummaryTile,
} from "@/widgets/killcount/entries/killcountEntriesModel";
import { honor } from "@/widgets/killcount/ui/killcountModel";

export const HEALCOUNT_PAGE = "/kill-counter/heals";

export function healcountHref(recordId: number) {
  return `${HEALCOUNT_PAGE}?record=${recordId}`;
}

export function selectRecord(records: HealcountRecord[], wanted?: string) {
  return (
    records.find((record) => String(record.id) === wanted) ?? records[0] ?? null
  );
}

export function recordDays(records: HealcountRecord[]) {
  return [...new Set(records.map((record) => record.day))];
}

export function byHonor(fighters: KillcountFighter[]) {
  return [...fighters].sort((a, b) => honor(b) - honor(a));
}

export function honorTiles(fighters: KillcountFighter[]): SummaryTile[] {
  const total = totalHonor(fighters);
  return [
    { label: "Всего хонора", value: formatNumber(total) },
    { label: "Хилов", value: String(fighters.length) },
    {
      label: "В среднем на хила",
      value: formatNumber(
        fighters.length ? Math.round(total / fighters.length) : 0,
      ),
    },
    {
      label: "Лучший",
      value: formatNumber(Math.max(0, ...fighters.map(honor))),
    },
  ];
}
