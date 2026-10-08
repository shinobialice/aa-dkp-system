import { ENGRAVING_STAT } from "../engravingBonuses";
import { STAT_LABEL } from "../itemsData/statEffects";
import type { DerivedStats } from "../characterStats";

import { bonusRow, computedRow, staticRow, type RowGroup } from "./statRows";

const BASE_HEAL_CRIT_EFFECT = 50;
const BASE_HEAL_RECEIVED = 100;

export function buildHealGroups(stats: DerivedStats): RowGroup[] {
  return [
    {
      title: "Исцеление",
      rows: [
        computedRow(
          "Шанс критического эффекта исцеления",
          stats.critChanceHeal,
          "%",
          1,
        ),
        bonusRow(
          "Критический эффект исцеления",
          BASE_HEAL_CRIT_EFFECT,
          "%",
          1,
          ENGRAVING_STAT.HEAL_CRIT_EFFECT,
        ),
        bonusRow(
          "Доп. эффективность умений целителя",
          0,
          "%",
          1,
          STAT_LABEL.HEALER_SKILL_BONUS,
        ),
        bonusRow(
          "Урон исцеляющими умениями",
          0,
          "%",
          1,
          STAT_LABEL.HEALING_SKILL_DMG,
          true,
        ),
        bonusRow(
          "Доп. эффективность исцеления",
          0,
          "%",
          1,
          ENGRAVING_STAT.HEAL_EFFECTIVENESS_BONUS,
          true,
        ),
        bonusRow(
          "Урон исцеляющими умениями в PvE",
          0,
          "%",
          1,
          STAT_LABEL.HEALING_SKILL_DMG_PVE,
          true,
        ),
      ],
    },
    {
      title: "Восстановление",
      rows: [
        computedRow("Восстановление здоровья", stats.healthRegen, "", 0),
        bonusRow(
          "Восстановление здоровья в бою",
          0,
          "",
          0,
          STAT_LABEL.COMBAT_HEALTH_REGEN,
        ),
        computedRow("Восстановление маны", stats.manaRegen, "", 0),
        bonusRow(
          "Восстановление маны в бою",
          0,
          "",
          0,
          STAT_LABEL.COMBAT_MANA_REGEN,
        ),
      ],
    },
    {
      title: "Прочее",
      rows: [
        bonusRow(
          "Восприимчивость к исцелению",
          BASE_HEAL_RECEIVED,
          "%",
          1,
          ENGRAVING_STAT.HEAL_RECEIVED,
        ),
        bonusRow(
          "Задержка применения умений при получении удара",
          0,
          "%",
          1,
          STAT_LABEL.CAST_PUSHBACK,
        ),
        staticRow("Доп. опыт", "100%"),
        staticRow("Доп. шанс получения трофеев", "100%"),
        staticRow("Доп. шанс получения монет", "100%"),
        bonusRow(
          "Дальность обнаружения скрытых существ",
          0,
          "%",
          0,
          STAT_LABEL.STEALTH_DETECTION,
        ),
      ],
    },
  ];
}

export const GEAR_GROUPS: RowGroup[] = [
  {
    title: "Доп. урон оружия",
    rows: [
      staticRow("Оружие для правой руки", "5000"),
      staticRow("Оружие для левой руки", "0"),
      staticRow("Оружие дальнего боя", "5000"),
    ],
  },
  {
    title: "Защита от доп. урона оружия",
    rows: [
      staticRow("Доспехи", "Лёгкие"),
      staticRow("Колющий урон", "5000"),
      staticRow("Режущий урон", "5000"),
      staticRow("Маг урон", "5000"),
      staticRow("Рубящий урон", "5000"),
      staticRow("Дробящий урон", "5000"),
    ],
  },
];
