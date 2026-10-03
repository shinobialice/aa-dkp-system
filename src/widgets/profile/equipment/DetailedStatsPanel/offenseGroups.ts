import { ENGRAVING_STAT } from "../engravingBonuses";
import { type DerivedStats, type EquippedBonuses } from "../characterStats";

import {
  computedRow,
  engravingRow,
  staticRow,
  type RowGroup,
} from "./statRows";

export function buildOffenseGroups(
  stats: DerivedStats,
  bonus: EquippedBonuses,
): RowGroup[] {
  return [
    {
      rows: [
        staticRow("Точность ударов в ближнем бою", "0.05%"),
        computedRow(
          "Шанс крит. удара в ближнем бою",
          stats.critChanceMelee,
          "%",
          2,
          bonus.str !== 0,
        ),
        engravingRow(
          "Критический урон в ближнем бою",
          150.0,
          "%",
          1,
          ENGRAVING_STAT.MELEE_CRIT_DAMAGE,
        ),
        staticRow("Урон в ближнем бою со спины", "100%"),
        staticRow("Доп урон умений ближнего боя", "100%"),
        engravingRow(
          "Доп урон умений ближнего боя в PVE",
          100,
          "%",
          1,
          ENGRAVING_STAT.MELEE_SKILL_DMG_PVE,
        ),
        engravingRow(
          "Доп урон умений ближнего боя в PVP",
          100,
          "%",
          1,
          ENGRAVING_STAT.MELEE_SKILL_DMG_PVP,
        ),
      ],
    },
    {
      rows: [
        staticRow("Точность ударов в дальнем бою", "0.05%"),
        computedRow(
          "Шанс крит. удара в дальнем бою",
          stats.critChanceRanged,
          "%",
          2,
          bonus.dex !== 0,
        ),
        engravingRow(
          "Критический урон в дальнем бою",
          150.0,
          "%",
          1,
          ENGRAVING_STAT.RANGED_CRIT_DAMAGE,
        ),
        staticRow("Урон в дальнем бою со спины", "100%"),
        staticRow("Доп урон умений дальнего боя", "100%"),
        engravingRow(
          "Доп урон умений дальнего боя в PVE",
          100,
          "%",
          1,
          ENGRAVING_STAT.RANGED_SKILL_DMG_PVE,
        ),
        engravingRow(
          "Доп урон умений дальнего боя в PVP",
          100,
          "%",
          1,
          ENGRAVING_STAT.RANGED_SKILL_DMG_PVP,
        ),
      ],
    },
    {
      rows: [
        staticRow("Точность заклинаний", "0.05%"),
        computedRow(
          "Шанс крит. удара заклинанием",
          stats.critChanceSpell,
          "%",
          2,
          bonus.int !== 0,
        ),
        engravingRow(
          "Критический урон заклинаний",
          150.0,
          "%",
          1,
          ENGRAVING_STAT.SPELL_CRIT_DAMAGE,
        ),
        staticRow("Урон заклинаниями со спины", "100%"),
        staticRow("Доп урон умений заклинателя", "100%"),
        engravingRow(
          "Доп урон умений заклинателя в PVE",
          100,
          "%",
          1,
          ENGRAVING_STAT.SPELL_SKILL_DMG_PVE,
        ),
        engravingRow(
          "Доп урон умений заклинателя в PVP",
          100,
          "%",
          1,
          ENGRAVING_STAT.SPELL_SKILL_DMG_PVP,
        ),
      ],
    },
    {
      rows: [
        computedRow(
          "Тактическая подготовка",
          stats.tacticalReadiness,
          "",
          0,
          bonus.str !== 0 || bonus.dex !== 0 || bonus.tacticalReadiness !== 0,
        ),
        staticRow("Шанс обхода обороны", "0%"),
        engravingRow(
          "Пробивание брони",
          0,
          "",
          0,
          ENGRAVING_STAT.ARMOR_PENETRATION,
        ),
        engravingRow(
          "Игнорирование сопротивления",
          0,
          "",
          0,
          ENGRAVING_STAT.RESIST_IGNORE,
        ),
      ],
    },
  ];
}
