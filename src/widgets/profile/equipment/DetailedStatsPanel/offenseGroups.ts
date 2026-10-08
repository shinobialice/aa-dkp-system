import { ENGRAVING_STAT } from "../engravingBonuses";
import { STAT_LABEL } from "../itemsData/statEffects";
import { BASE_CHARACTER_STATS, type DerivedStats } from "../characterStats";
import { computeAttributeAccuracy } from "../attributeFormulas";

import { bonusRow, computedRow, type RowGroup } from "./statRows";

type AttackKind = {
  accuracy: [label: string, key: string, fromAttributes: number];
  critChance: [label: string, value: number];
  critDamage: [label: string, key: string];
  backstab: [label: string, key: string];
  skillDamage: [label: string, key: string];
  pveDamage: [label: string, key: string];
  pvpDamage: [label: string, key: string];
};

// База и потолок точности подобраны по окну характеристик игры: без снаряжения
// при 203 силе и 46 героическом уровне там ровно 90%.
const BASE_ACCURACY = 85;
const MAX_ACCURACY = 100;
const BASE_CRIT_DAMAGE = 150;
const BASE_DAMAGE_PERCENT = 100;

export function buildOffenseGroups(stats: DerivedStats): RowGroup[] {
  const base = BASE_CHARACTER_STATS;
  return [
    attackGroup({
      accuracy: [
        "Точность ударов в ближнем бою",
        STAT_LABEL.MELEE_ACCURACY,
        computeAttributeAccuracy(stats.str),
      ],
      critChance: ["Шанс крит. удара в ближнем бою", stats.critChanceMelee],
      critDamage: [
        "Критический урон в ближнем бою",
        ENGRAVING_STAT.MELEE_CRIT_DAMAGE,
      ],
      backstab: ["Урон в ближнем бою со спины", STAT_LABEL.MELEE_BACKSTAB],
      skillDamage: ["Доп урон умений ближнего боя", STAT_LABEL.MELEE_SKILL_DMG],
      pveDamage: [
        "Доп урон умений ближнего боя в PVE",
        ENGRAVING_STAT.MELEE_SKILL_DMG_PVE,
      ],
      pvpDamage: [
        "Доп урон умений ближнего боя в PVP",
        ENGRAVING_STAT.MELEE_SKILL_DMG_PVP,
      ],
    }),
    attackGroup({
      accuracy: [
        "Точность ударов в дальнем бою",
        STAT_LABEL.RANGED_ACCURACY,
        computeAttributeAccuracy(stats.dex),
      ],
      critChance: ["Шанс крит. удара в дальнем бою", stats.critChanceRanged],
      critDamage: [
        "Критический урон в дальнем бою",
        ENGRAVING_STAT.RANGED_CRIT_DAMAGE,
      ],
      backstab: ["Урон в дальнем бою со спины", STAT_LABEL.RANGED_BACKSTAB],
      skillDamage: [
        "Доп урон умений дальнего боя",
        STAT_LABEL.RANGED_SKILL_DMG,
      ],
      pveDamage: [
        "Доп урон умений дальнего боя в PVE",
        ENGRAVING_STAT.RANGED_SKILL_DMG_PVE,
      ],
      pvpDamage: [
        "Доп урон умений дальнего боя в PVP",
        ENGRAVING_STAT.RANGED_SKILL_DMG_PVP,
      ],
    }),
    attackGroup({
      accuracy: [
        "Точность заклинаний",
        STAT_LABEL.SPELL_ACCURACY,
        computeAttributeAccuracy((stats.int + stats.spi) / 2),
      ],
      critChance: ["Шанс крит. удара заклинанием", stats.critChanceSpell],
      critDamage: [
        "Критический урон заклинаний",
        ENGRAVING_STAT.SPELL_CRIT_DAMAGE,
      ],
      backstab: ["Урон заклинаниями со спины", STAT_LABEL.SPELL_BACKSTAB],
      skillDamage: ["Доп урон умений заклинателя", STAT_LABEL.SPELL_SKILL_DMG],
      pveDamage: [
        "Доп урон умений заклинателя в PVE",
        ENGRAVING_STAT.SPELL_SKILL_DMG_PVE,
      ],
      pvpDamage: [
        "Доп урон умений заклинателя в PVP",
        ENGRAVING_STAT.SPELL_SKILL_DMG_PVP,
      ],
    }),
    {
      rows: [
        computedRow("Тактическая подготовка", stats.tacticalReadiness, "", 0),
        bonusRow("Шанс обхода обороны", 0, "%", 1, STAT_LABEL.DEFENSE_BYPASS),
        bonusRow(
          "Пробивание брони",
          0,
          "",
          0,
          ENGRAVING_STAT.ARMOR_PENETRATION,
        ),
        bonusRow(
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

function attackGroup(kind: AttackKind): RowGroup {
  const [accuracyLabel, accuracyKey, accuracyFromAttributes] = kind.accuracy;
  const [critLabel, critValue] = kind.critChance;
  return {
    rows: [
      {
        ...bonusRow(
          accuracyLabel,
          BASE_ACCURACY + accuracyFromAttributes,
          "%",
          1,
          accuracyKey,
        ),
        max: MAX_ACCURACY,
      },
      computedRow(critLabel, critValue, "%", 1),
      bonusRow(
        kind.critDamage[0],
        BASE_CRIT_DAMAGE,
        "%",
        1,
        kind.critDamage[1],
      ),
      bonusRow(kind.backstab[0], BASE_DAMAGE_PERCENT, "%", 1, kind.backstab[1]),
      bonusRow(
        kind.skillDamage[0],
        BASE_DAMAGE_PERCENT,
        "%",
        1,
        kind.skillDamage[1],
      ),
      bonusRow(
        kind.pveDamage[0],
        BASE_DAMAGE_PERCENT,
        "%",
        1,
        kind.pveDamage[1],
      ),
      bonusRow(
        kind.pvpDamage[0],
        BASE_DAMAGE_PERCENT,
        "%",
        1,
        kind.pvpDamage[1],
      ),
    ],
  };
}
