import { formatNumber } from "@/shared/lib/format";
import {
  attributeColumns,
  powerStats,
  utilityStats,
  type StatLine,
} from "@/widgets/profile/equipment/CharacterStatsPanel/statSections";
import { buildDefenseGroups } from "@/widgets/profile/equipment/DetailedStatsPanel/defenseGroups";
import { buildGearGroups } from "@/widgets/profile/equipment/DetailedStatsPanel/gearGroups";
import { buildHealGroups } from "@/widgets/profile/equipment/DetailedStatsPanel/healGroups";
import { buildOffenseGroups } from "@/widgets/profile/equipment/DetailedStatsPanel/offenseGroups";
import {
  computedRow,
  rowValue,
  type Row,
  type RowGroup,
  type RowValue,
} from "@/widgets/profile/equipment/DetailedStatsPanel/statRows";
import { computeTestGearScore } from "@/widgets/profile/equipment/gearScore";
import {
  isLowerBetter,
  statDiff,
  type ProfileStats,
} from "@/widgets/profile/equipment/statComparison";
import type { CalculatorBuild } from "../calculatorModel";

export type DiffTone = "better" | "worse" | "same";

export type CompareRow = {
  label: string;
  a: string;
  b: string;
  diff: string;
  tone: DiffTone;
};

export type CompareGroup = { title: string; rows: CompareRow[] };

export type CompareTabKey = "main" | "offense" | "defense" | "heal" | "gear";

export type CompareTab = {
  key: CompareTabKey;
  title: string;
  groups: CompareGroup[];
  diffCount: number;
};

export type CompareSide = { build: CalculatorBuild; stats: ProfileStats };

export type CompareTile = CompareRow;

type Difference = Pick<CompareRow, "diff" | "tone">;

type TabSource = {
  key: CompareTabKey;
  title: string;
  groups: (profile: ProfileStats) => RowGroup[];
};

type TileSource = {
  label: string;
  decimals: number;
  valueOf: (side: CompareSide) => number;
};

const SAME: Difference = { diff: "—", tone: "same" };

const TAB_SOURCES: TabSource[] = [
  { key: "main", title: "Основное", groups: mainGroups },
  {
    key: "offense",
    title: "Атака",
    groups: (p) => buildOffenseGroups(p.stats),
  },
  {
    key: "defense",
    title: "Защита",
    groups: (p) => buildDefenseGroups(p.stats),
  },
  { key: "heal", title: "Исцеление", groups: (p) => buildHealGroups(p.stats) },
  { key: "gear", title: "Прочее", groups: (p) => buildGearGroups(p.gear) },
];

const TILE_SOURCES: TileSource[] = [
  {
    label: "ГС (примерно)",
    decimals: 0,
    valueOf: ({ build }) => computeTestGearScore(build.equipment, build.seals),
  },
  {
    label: "Эффективность исцеления",
    decimals: 2,
    valueOf: ({ stats }) => stats.stats.healPower,
  },
  {
    label: "Сила атаки в ближнем бою",
    decimals: 2,
    valueOf: ({ stats }) => stats.stats.meleeAttack,
  },
  { label: "Защита", decimals: 0, valueOf: ({ stats }) => stats.stats.defense },
  {
    label: "Здоровье",
    decimals: 0,
    valueOf: ({ stats }) => stats.stats.health,
  },
];

export function buildCompareTiles(
  a: CompareSide,
  b: CompareSide,
): CompareTile[] {
  return TILE_SOURCES.map((tile) => {
    const valueA = tile.valueOf(a);
    const valueB = tile.valueOf(b);
    const format = (value: number) => formatNumber(value, tile.decimals);
    return {
      label: tile.label,
      a: format(valueA),
      b: format(valueB),
      ...difference(tile.label, valueA, valueB, tile.decimals, format),
    };
  });
}

export function buildCompareTabs(
  a: ProfileStats,
  b: ProfileStats,
): CompareTab[] {
  return TAB_SOURCES.map((source) => {
    const groupsB = source.groups(b);
    const groups = source.groups(a).map((group, index) => ({
      title: group.title ?? "",
      rows: group.rows.map((row, rowIndex) =>
        compareRow(row, a.flat, groupsB[index]?.rows[rowIndex], b.flat),
      ),
    }));
    const diffCount = groups
      .flatMap((group) => group.rows)
      .filter((row) => row.tone !== "same").length;
    return { key: source.key, title: source.title, groups, diffCount };
  });
}

export function onlyDifferences(groups: CompareGroup[]): CompareGroup[] {
  return groups
    .map((group) => ({
      ...group,
      rows: group.rows.filter((row) => row.tone !== "same"),
    }))
    .filter((group) => group.rows.length > 0);
}

function mainGroups(profile: ProfileStats): RowGroup[] {
  return [
    { title: "Сила и защита", rows: powerStats(profile.stats).map(lineRow) },
    {
      title: "Характеристики",
      rows: attributeColumns(profile.stats).flat().map(lineRow),
    },
    { title: "Разное", rows: utilityStats(profile.stats).map(lineRow) },
  ];
}

function lineRow(line: StatLine): Row {
  return computedRow(line.label, line.amount, line.unit ?? "", line.decimals);
}

function compareRow(
  rowA: Row,
  flatA: Map<string, number>,
  rowB: Row | undefined,
  flatB: Map<string, number>,
): CompareRow {
  const valueA = rowValue(rowA, flatA);
  const valueB = rowB ? rowValue(rowB, flatB) : null;
  return {
    label: rowA.label,
    a: valueA.text,
    b: valueB?.text ?? "—",
    ...rowDifference(rowA, valueA, valueB),
  };
}

function rowDifference(row: Row, a: RowValue, b: RowValue | null): Difference {
  if (!b || a.amount === null || b.amount === null) return SAME;
  const decimals = Math.max(a.decimals, b.decimals);
  const unit = row.kind === "static" ? "" : row.unit;
  return difference(
    row.label,
    a.amount,
    b.amount,
    decimals,
    (value) => `${value.toFixed(decimals)}${unit}`,
  );
}

function difference(
  label: string,
  a: number,
  b: number,
  decimals: number,
  format: (value: number) => string,
): Difference {
  const diff = statDiff(a, b, decimals);
  if (diff === 0) return SAME;
  const isBetter = isLowerBetter(label) ? diff < 0 : diff > 0;
  const sign = diff > 0 ? "▲ +" : "▼ −";
  return {
    diff: `${sign}${format(Math.abs(diff))}`,
    tone: isBetter ? "better" : "worse",
  };
}
