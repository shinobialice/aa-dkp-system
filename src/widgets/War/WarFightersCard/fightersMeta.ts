import { formatNumber } from "@/shared/lib/format";
import { formatDecimal, type Fighter, type FighterSort } from "../warModel";

export const FIGHTER_COLUMNS =
  "grid-cols-[28px_minmax(0,1fr)_88px_96px_76px] md:grid-cols-[28px_minmax(0,1fr)_112px_112px_92px]";

export const SORT_OPTIONS: { value: FighterSort; label: string }[] = [
  { value: "kills", label: "Киллы" },
  { value: "honor", label: "Хонор" },
  { value: "raids", label: "Рейды" },
];

export const METRIC_LABEL: Record<FighterSort, string> = {
  kills: "киллы",
  honor: "хонор",
  raids: "рейды",
};

export type MetricMax = Record<FighterSort, number>;

export function metricMax(fighters: Fighter[], totalRaids: number): MetricMax {
  return {
    kills: Math.max(1, ...fighters.map((fighter) => fighter.kills ?? 0)),
    honor: Math.max(1, ...fighters.map((fighter) => fighter.honor ?? 0)),
    raids: Math.max(1, totalRaids),
  };
}

export function formatMetric(
  key: FighterSort,
  value: number | null,
  totalRaids: number,
) {
  if (value === null) return "—";
  if (key === "raids") return `${formatDecimal(value)}/${totalRaids}`;
  return formatNumber(value);
}
