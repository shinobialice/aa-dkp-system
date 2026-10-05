import type { UserEquipment } from "@/actions/getUserEquipment";
import type { UserSeal } from "@/actions/getUserSeals";
import { computeSealBonusSummary } from "@/widgets/profile/seals/sealBonusSummary";
import { ITEM_STATS, findGearItem } from "./itemsData";
import {
  getItemGradeBonusStats,
  getItemGradeStats,
} from "./itemsData/itemGradeStats";
import { scaleStat, STAT_LABELS } from "./itemsData/statsFormula";
import { addStat, STAT_LABEL, type StatBonuses } from "./itemsData/statEffects";
import { computeEngravingBonuses, ENGRAVING_STAT } from "./engravingBonuses";
import { computeRuneSetBonuses } from "./runeSetBonus";
import { computeRuneBonuses } from "./runeBonuses";
import { computeSynthesisBonuses } from "./synthesisBonuses";
import { computeSetStatBonuses } from "./setStatBonuses";
import { computeItemPassiveBonuses } from "./itemPassives";
import { computeBuffStatBonuses, type SelectedBuffs } from "./characterBuffs";
import {
  computeEpheSealsFlatBonus,
  getEpheStatMultipliers,
} from "../ephe/epheSealsBonus";
import { type EquippedBonuses } from "./characterStats";

export const EMPTY_BONUSES: EquippedBonuses = {
  manaPercent: 0,
  defense: 0,
  resist: 0,
  str: 0,
  int: 0,
  dex: 0,
  spi: 0,
  sta: 0,
  health: 0,
  mana: 0,
  meleeAttack: 0,
  rangedAttack: 0,
  spellPower: 0,
  healPower: 0,
  moveSpeed: 0,
  skillSpeed: 0,
  proficiency: 0,
  tacticalReadiness: 0,
  parry: 0,
  dodge: 0,
  block: 0,
  pvpResist: 0,
  critDamageResist: 0,
  critChanceMelee: 0,
  critChanceRanged: 0,
  critChanceSpell: 0,
  critChanceHeal: 0,
  healthRegen: 0,
  manaRegen: 0,
};

export const ATTRIBUTES = ["str", "int", "dex", "spi", "sta"] as const;

export const FLAT_STAT_TARGETS: [keyof EquippedBonuses, string][] = [
  ["str", STAT_LABEL.STR],
  ["int", STAT_LABEL.INT],
  ["dex", STAT_LABEL.DEX],
  ["spi", STAT_LABEL.SPI],
  ["sta", STAT_LABEL.STA],
  ["defense", ENGRAVING_STAT.DEFENSE],
  ["resist", ENGRAVING_STAT.RESIST],
  ["health", ENGRAVING_STAT.HEALTH],
  ["mana", ENGRAVING_STAT.MANA],
  ["meleeAttack", ENGRAVING_STAT.MELEE_ATTACK],
  ["rangedAttack", ENGRAVING_STAT.RANGED_ATTACK],
  ["spellPower", ENGRAVING_STAT.SPELL_POWER],
  ["healPower", ENGRAVING_STAT.HEAL_POWER],
  ["moveSpeed", ENGRAVING_STAT.MOVE_SPEED],
  ["skillSpeed", ENGRAVING_STAT.SKILL_SPEED],
  ["proficiency", ENGRAVING_STAT.PROFICIENCY],
  ["tacticalReadiness", ENGRAVING_STAT.TACTICAL_READINESS],
  ["parry", ENGRAVING_STAT.PARRY],
  ["dodge", ENGRAVING_STAT.DODGE],
  ["block", ENGRAVING_STAT.BLOCK],
  ["pvpResist", ENGRAVING_STAT.PVP_RESIST],
  ["critDamageResist", ENGRAVING_STAT.CRIT_DAMAGE_RESIST],
  ["critChanceMelee", ENGRAVING_STAT.MELEE_CRIT_CHANCE],
  ["critChanceRanged", ENGRAVING_STAT.RANGED_CRIT_CHANCE],
  ["critChanceSpell", ENGRAVING_STAT.SPELL_CRIT_CHANCE],
  ["critChanceHeal", ENGRAVING_STAT.HEAL_CRIT_CHANCE],
  ["healthRegen", STAT_LABEL.HEALTH_REGEN],
  ["manaRegen", STAT_LABEL.MANA_REGEN],
];

const RANGED_WEAPON_SLOT = "weapon_ranged";

// Урон оружия в слотах 1–2 идёт в силу атаки в ближнем бою, урон лука или
// винтовки — в силу атаки в дальнем бою.
function weaponStatLabel(key: string, slot: string): string | undefined {
  if (key === "weapon_dps") {
    return slot === RANGED_WEAPON_SLOT
      ? ENGRAVING_STAT.RANGED_ATTACK
      : ENGRAVING_STAT.MELEE_ATTACK;
  }
  if (key === "weapon_magic_power") return ENGRAVING_STAT.SPELL_POWER;
  if (key === "weapon_heal_power") return ENGRAVING_STAT.HEAL_POWER;
  return undefined;
}

const FLAT_GEAR_STAT_LABELS: Record<string, string> = {
  flat_sta: STAT_LABEL.STA,
  flat_spi: STAT_LABEL.SPI,
};

export function addGearStats(
  totals: EquippedBonuses,
  flat: StatBonuses,
  eq: UserEquipment,
) {
  const gearItem = findGearItem(eq.slot, eq.item_name);
  if (!gearItem) return;
  const gradeStats = getItemGradeStats(gearItem.id, eq.grade);
  const bonusStats = getItemGradeBonusStats(gearItem.id, eq.grade) ?? {};
  const base = gradeStats ?? ITEM_STATS[gearItem.id] ?? {};

  const epheMultipliers = getEpheStatMultipliers(eq);
  for (const [key, value] of Object.entries(base)) {
    if (key in bonusStats) continue;
    // Статы из ITEM_GRADE_STATS уже финальные для грейда, scaleStat к ним не применяется.
    const gradeValue = gradeStats
      ? value
      : scaleStat(value, eq.grade, eq.enchant ?? 0, key);
    const scaled = gradeValue * (epheMultipliers[key] ?? 1);
    addItemStat(totals, flat, eq.slot, key, scaled);
  }
  for (const [key, value] of Object.entries(bonusStats)) {
    const scaled = value * (epheMultipliers[key] ?? 1);
    addItemStat(totals, flat, eq.slot, key, scaled);
  }
}

function addItemStat(
  totals: EquippedBonuses,
  flat: StatBonuses,
  slot: string,
  key: string,
  value: number,
) {
  const weaponLabel = weaponStatLabel(key, slot);
  if (key === "wearable_armor") totals.defense += value;
  else if (key === "wearable_magic_resistance") totals.resist += value;
  else if (weaponLabel) addStat(flat, weaponLabel, value);
  else {
    const label = FLAT_GEAR_STAT_LABELS[key] ?? STAT_LABELS[key];
    if (label) addStat(flat, label, value);
  }
}

export function collectStatSources(
  equipment: UserEquipment[],
  seals: UserSeal[],
  buffs: SelectedBuffs,
): Iterable<[string, number]>[] {
  const sealPicks = seals.map((seal) => ({
    sealName: seal.seal_name,
    level: seal.level,
  }));
  return [
    computeEngravingBonuses(equipment),
    computeRuneBonuses(equipment),
    computeRuneSetBonuses(equipment),
    computeSynthesisBonuses(equipment),
    computeSetStatBonuses(equipment),
    computeItemPassiveBonuses(equipment),
    computeBuffStatBonuses(buffs),
    computeSealBonusSummary(sealPicks).map(
      ({ stat, value }): [string, number] => [stat, value],
    ),
    computeEpheSealsFlatBonus(equipment),
  ];
}
