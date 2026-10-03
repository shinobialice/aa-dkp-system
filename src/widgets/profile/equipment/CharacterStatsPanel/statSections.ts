import type { DerivedStats, EquippedBonuses } from "../characterStats";
import { ATTRIBUTE_TOOLTIPS } from "../attributeTooltips";

export type StatLine = {
  label: string;
  value: string;
  boosted: boolean;
  tooltip?: { title: string; lines: string[] };
};

export function powerStats(
  stats: DerivedStats,
  bonus: EquippedBonuses,
): StatLine[] {
  return [
    {
      label: "Сила атаки в ближнем бою",
      value: stats.meleeAttack.toFixed(2),
      boosted: bonus.meleeAttack !== 0 || bonus.str !== 0,
    },
    {
      label: "Сила атаки в дальнем бою",
      value: stats.rangedAttack.toFixed(2),
      boosted: bonus.rangedAttack !== 0 || bonus.dex !== 0,
    },
    {
      label: "Сила заклинаний",
      value: stats.spellPower.toFixed(2),
      boosted: bonus.spellPower !== 0 || bonus.int !== 0,
    },
    {
      label: "Эффективность исцеления",
      value: stats.healPower.toFixed(2),
      boosted: bonus.healPower !== 0 || bonus.spi !== 0,
    },
    {
      label: "Защита",
      value: String(Math.round(stats.defense)),
      boosted: bonus.defense !== 0 || bonus.sta !== 0,
    },
    {
      label: "Сопротивление",
      value: String(Math.round(stats.resist)),
      boosted: bonus.resist !== 0 || bonus.sta !== 0,
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

export function attributeColumns(
  stats: DerivedStats,
  bonus: EquippedBonuses,
): StatLine[][] {
  return ATTRIBUTE_COLUMNS.map((column) =>
    column.map(({ key, label }) => ({
      label,
      value: String(stats[key]),
      boosted: bonus[key] > 0,
      tooltip: ATTRIBUTE_TOOLTIPS[key],
    })),
  );
}

export function utilityStats(
  stats: DerivedStats,
  bonus: EquippedBonuses,
): StatLine[] {
  return [
    {
      label: "Скорость передвижения",
      value: `${stats.moveSpeed.toFixed(1)} м/с`,
      boosted: bonus.moveSpeed !== 0,
    },
    {
      label: "Время применения умений",
      value: `${stats.skillSpeed.toFixed(1)}%`,
      boosted: bonus.skillSpeed !== 0,
    },
    {
      label: "Сноровка",
      value: String(stats.proficiency),
      boosted: bonus.proficiency !== 0,
    },
    {
      label: "Устойчивость к атакам в PvP",
      value: String(stats.pvpResist),
      boosted: bonus.pvpResist !== 0,
    },
    {
      label: "Устойчивость к критическому урону",
      value: String(stats.critDamageResist),
      boosted: bonus.critDamageResist !== 0,
    },
  ];
}
