import type { UserEquipment } from "@/actions/getUserEquipment";
import { ENGRAVING_STAT } from "./engravingBonuses";
import type { ArmorWeight } from "./itemsData/armorType";
import { addStat, STAT_LABEL, type StatBonuses } from "./itemsData/statEffects";
import { getActiveSetBuffs, type SetBuffTier } from "./setBonuses";
import { getActiveQualitySetBuffs } from "./qualitySetBonus";
import { getActiveWeaponBuff, type WeaponBuff } from "./weaponBuffs";

type StatLine = [label: string, value: number];

type ArmorSetBuffStats = {
  stats: StatLine[];
  defensePercent: number;
  resistPercent: number;
};

export type EquipmentBuffBonuses = {
  stats: StatBonuses;
  defensePercent: number;
  resistPercent: number;
};

const ARMOR_SET_BUFF_STATS: Record<
  ArmorWeight,
  Record<SetBuffTier, ArmorSetBuffStats>
> = {
  light: {
    partial: {
      stats: [
        [ENGRAVING_STAT.MOVE_SPEED, 1],
        [ENGRAVING_STAT.HEAL_RECEIVED, 5],
      ],
      defensePercent: 0,
      resistPercent: 2,
    },
    full: {
      stats: [
        [ENGRAVING_STAT.MOVE_SPEED, 1],
        [ENGRAVING_STAT.HEAL_RECEIVED, 10],
        [ENGRAVING_STAT.CRIT_DAMAGE_RESIST, 100],
      ],
      defensePercent: 0,
      resistPercent: 3,
    },
  },
  medium: {
    partial: {
      stats: [
        [ENGRAVING_STAT.DODGE, 3],
        [ENGRAVING_STAT.MOVE_SPEED, 3],
      ],
      defensePercent: 0,
      resistPercent: 0,
    },
    full: {
      stats: [
        [ENGRAVING_STAT.DODGE, 3],
        [ENGRAVING_STAT.CRIT_DAMAGE_RESIST, 200],
      ],
      defensePercent: 1,
      resistPercent: 1,
    },
  },
  heavy: {
    partial: {
      stats: [
        [ENGRAVING_STAT.CRIT_DAMAGE_RESIST, 100],
        [ENGRAVING_STAT.MOVE_SPEED, -3],
        [ENGRAVING_STAT.DODGE, -3],
      ],
      defensePercent: 2,
      resistPercent: 0,
    },
    full: {
      stats: [
        [ENGRAVING_STAT.CRIT_DAMAGE_RESIST, 300],
        [ENGRAVING_STAT.MOVE_SPEED, -3],
        [ENGRAVING_STAT.DODGE, -3],
      ],
      defensePercent: 3,
      resistPercent: 0,
    },
  },
};

const ACCURACY_LABELS = [
  STAT_LABEL.MELEE_ACCURACY,
  STAT_LABEL.RANGED_ACCURACY,
  STAT_LABEL.SPELL_ACCURACY,
];

const SKILL_DAMAGE_LABELS = [
  STAT_LABEL.MELEE_SKILL_DMG,
  STAT_LABEL.RANGED_SKILL_DMG,
  STAT_LABEL.SPELL_SKILL_DMG,
  STAT_LABEL.HEALER_SKILL_BONUS,
];

const CRIT_DAMAGE_LABELS = [
  ENGRAVING_STAT.MELEE_CRIT_DAMAGE,
  ENGRAVING_STAT.RANGED_CRIT_DAMAGE,
  ENGRAVING_STAT.SPELL_CRIT_DAMAGE,
  ENGRAVING_STAT.HEAL_CRIT_EFFECT,
];

const each = (labels: string[], value: number): StatLine[] =>
  labels.map((label) => [label, value]);

// Двуручное и оружие в обеих руках — числа из калькулятора marafon.direkiller.ru;
// щит — по подсказке и окну характеристик игры (крит. урон он не даёт).
const WEAPON_BUFF_STATS: Record<WeaponBuff["key"], StatLine[]> = {
  two_handed: [
    ...each(ACCURACY_LABELS, 7),
    ...each(SKILL_DAMAGE_LABELS, 3),
    [STAT_LABEL.DEFENSE_BYPASS, 60],
    [ENGRAVING_STAT.TACTICAL_READINESS, 200],
  ],
  dual_wield: [
    [ENGRAVING_STAT.PROFICIENCY, 177],
    [ENGRAVING_STAT.SKILL_SPEED, -5],
    ...each(ACCURACY_LABELS, 5),
    ...each(CRIT_DAMAGE_LABELS, 4),
    [STAT_LABEL.DEFENSE_BYPASS, 30],
    [ENGRAVING_STAT.TACTICAL_READINESS, 400],
  ],
  shield: [
    ...each(ACCURACY_LABELS, 3),
    ...each(SKILL_DAMAGE_LABELS, 1),
    [ENGRAVING_STAT.TACTICAL_READINESS, 100],
  ],
};

const QUALITY_HEALTH_LINE = /Объем здоровья \+(\d+)/;
const QUALITY_MANA_LINE = /Объем маны \+(\d+)/;
const QUALITY_SKILL_LINE = /(?:целительных|исцеляющих) умений \+([\d.]+)%/;

export function computeEquipmentBuffBonuses(
  equipment: UserEquipment[],
): EquipmentBuffBonuses {
  const stats: StatBonuses = new Map();
  let defensePercent = 0;
  let resistPercent = 0;

  for (const buff of getActiveSetBuffs(equipment)) {
    const buffStats = ARMOR_SET_BUFF_STATS[buff.weight][buff.tier];
    for (const [label, value] of buffStats.stats) addStat(stats, label, value);
    defensePercent += buffStats.defensePercent;
    resistPercent += buffStats.resistPercent;
  }

  const weaponBuff = getActiveWeaponBuff(equipment);
  if (weaponBuff) {
    for (const [label, value] of WEAPON_BUFF_STATS[weaponBuff.key]) {
      addStat(stats, label, value);
    }
  }

  for (const buff of getActiveQualitySetBuffs(equipment)) {
    for (const [label, value] of qualitySetStats(buff.description)) {
      addStat(stats, label, value);
    }
  }

  return { stats, defensePercent, resistPercent };
}

function qualitySetStats(description: string): StatLine[] {
  const health = Number(description.match(QUALITY_HEALTH_LINE)?.[1] ?? 0);
  const mana = Number(description.match(QUALITY_MANA_LINE)?.[1] ?? 0);
  const skill = Number(description.match(QUALITY_SKILL_LINE)?.[1] ?? 0);
  return [
    [ENGRAVING_STAT.HEALTH, health],
    [ENGRAVING_STAT.MANA, mana],
    ...each(SKILL_DAMAGE_LABELS, skill),
  ];
}
