import { ENGRAVING_STAT } from "../engravingBonuses";
import { type DerivedStats, type EquippedBonuses } from "../characterStats";

import {
  computedRow,
  engravingRow,
  staticRow,
  type RowGroup,
} from "./statRows";

export function buildHealGroups(
  stats: DerivedStats,
  bonus: EquippedBonuses,
): RowGroup[] {
  return [
    {
      title: "Исцеление",
      rows: [
        computedRow(
          "Шанс критического эффекта исцеления",
          stats.critChanceHeal,
          "%",
          2,
          bonus.spi !== 0,
        ),
        engravingRow(
          "Критический эффект исцеления",
          50,
          "%",
          0,
          ENGRAVING_STAT.HEAL_CRIT_EFFECT,
        ),
        staticRow("Доп. эффективность умений целителя", "0%"),
        staticRow("Урон исцеляющими умениями", "0%", true),
        engravingRow(
          "Доп. эффективность исцеления",
          0,
          "%",
          1,
          ENGRAVING_STAT.HEAL_EFFECTIVENESS_BONUS,
          true,
        ),
        staticRow("Урон исцеляющими умениями в PvE", "0%", true),
      ],
    },
    {
      title: "Восстановление",
      rows: [
        computedRow(
          "Восстановление здоровья",
          stats.healthRegen,
          "",
          0,
          bonus.sta !== 0,
        ),
        staticRow("Восстановление здоровья в бою", "0"),
        computedRow(
          "Восстановление маны",
          stats.manaRegen,
          "",
          0,
          bonus.spi !== 0,
        ),
        staticRow("Восстановление маны в бою", "0"),
      ],
    },
    {
      title: "Прочее",
      rows: [
        engravingRow(
          "Восприимчивость к исцелению",
          0,
          "%",
          1,
          ENGRAVING_STAT.HEAL_RECEIVED,
        ),
        staticRow("Дополнительный опыт", "100%"),
        staticRow("Дополнительный шанс получения трофеев", "100%"),
        staticRow("Дополнительный шанс получения монет", "100%"),
        staticRow("Дальность обнаружения скрытых существ", "0%"),
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
