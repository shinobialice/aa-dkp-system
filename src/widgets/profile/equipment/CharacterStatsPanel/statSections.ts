import type { DerivedStats } from "../characterStats";
import { ATTRIBUTE_TOOLTIPS } from "../attributeTooltips";

export type StatLine = {
  label: string;
  amount: number;
  decimals: number;
  unit?: string;
  tooltip?: { title: string; lines: string[] };
};

export function formatStatLine(line: StatLine): string {
  return `${line.amount.toFixed(line.decimals)}${line.unit ?? ""}`;
}

export function powerStats(stats: DerivedStats): StatLine[] {
  return [
    {
      label: "Сила атаки в ближнем бою",
      amount: stats.meleeAttack,
      decimals: 2,
    },
    {
      label: "Сила атаки в дальнем бою",
      amount: stats.rangedAttack,
      decimals: 2,
    },
    {
      label: "Сила заклинаний",
      amount: stats.spellPower,
      decimals: 2,
    },
    {
      label: "Эффективность исцеления",
      amount: stats.healPower,
      decimals: 2,
    },
    {
      label: "Защита",
      amount: stats.defense,
      decimals: 0,
    },
    {
      label: "Сопротивление",
      amount: stats.resist,
      decimals: 0,
    },
  ];
}

type AttributeKey = "str" | "int" | "dex" | "spi" | "sta";

const ATTRIBUTE_COLUMNS: { key: AttributeKey; label: string }[][] = [
  [
    { key: "str", label: "Сила" },
    { key: "int", label: "Интеллект" },
    { key: "dex", label: "Ловкость" },
  ],
  [
    { key: "spi", label: "Сила духа" },
    { key: "sta", label: "Выносливость" },
  ],
];

export function attributeColumns(stats: DerivedStats): StatLine[][] {
  return ATTRIBUTE_COLUMNS.map((column) =>
    column.map(({ key, label }) => ({
      label,
      amount: stats[key],
      decimals: 0,
      tooltip: ATTRIBUTE_TOOLTIPS[key],
    })),
  );
}

export function utilityStats(stats: DerivedStats): StatLine[] {
  return [
    {
      label: "Скорость передвижения",
      amount: stats.moveSpeed,
      decimals: 1,
      unit: " м/с",
    },
    {
      label: "Время применения умений",
      amount: stats.skillSpeed,
      decimals: 1,
      unit: "%",
    },
    {
      label: "Сноровка",
      amount: stats.proficiency,
      decimals: 0,
    },
    {
      label: "Устойчивость к атакам в PvP",
      amount: stats.pvpResist,
      decimals: 0,
    },
    {
      label: "Устойчивость к критическому урону",
      amount: stats.critDamageResist,
      decimals: 0,
    },
  ];
}
