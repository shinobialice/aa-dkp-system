import type { UserEquipment } from "@/actions/getUserEquipment";
import type { UserSeal } from "@/actions/getUserSeals";
import { computeEphenSynthesisBonuses } from "./ephenSynthesisBonus";
import {
  computeParry,
  computeDodge,
  computeBlock,
  computeTacticalReadiness,
  computeSkillTimeReduction,
  computeManaRegen,
  computeHealthRegen,
  computeCritChance,
} from "./attributeFormulas";
import {
  EMPTY_BONUSES,
  ATTRIBUTES,
  FLAT_STAT_TARGETS,
  addGearStats,
  collectFlatBonuses,
} from "./equippedBonusParts";

export const BASE_CHARACTER_STATS = {
  health: 10246,
  mana: 7180,
  defense: 158,
  resist: 158,
  str: 158,
  int: 158,
  dex: 158,
  spi: 158,
  sta: 158,
  moveSpeed: 5.4,
  proficiency: 0,
};

export type EquippedBonuses = {
  defense: number;
  resist: number;
  str: number;
  int: number;
  dex: number;
  spi: number;
  sta: number;
  health: number;
  mana: number;
  meleeAttack: number;
  rangedAttack: number;
  spellPower: number;
  healPower: number;
  moveSpeed: number;
  skillSpeed: number;
  proficiency: number;
  tacticalReadiness: number;
  parry: number;
  dodge: number;
  block: number;
  pvpResist: number;
  critDamageResist: number;
};

export function computeEquippedBonuses(
  equipment: UserEquipment[],
  seals: UserSeal[] = [],
): EquippedBonuses {
  const totals = { ...EMPTY_BONUSES };
  for (const eq of equipment) addGearStats(totals, eq);

  const ephenSynthesis = computeEphenSynthesisBonuses(equipment);
  for (const attribute of ATTRIBUTES) {
    totals[attribute] += ephenSynthesis.attributes[attribute];
  }

  const flat = collectFlatBonuses(equipment, seals, ephenSynthesis.stats);
  for (const [key, stat] of FLAT_STAT_TARGETS) {
    totals[key] += flat.get(stat) ?? 0;
  }
  return totals;
}

const FLAT_HEALTH_POOL =
  BASE_CHARACTER_STATS.health - BASE_CHARACTER_STATS.sta * 12;

const FLAT_MANA_POOL =
  BASE_CHARACTER_STATS.mana - BASE_CHARACTER_STATS.int * 10;

export type DerivedStats = {
  str: number;
  dex: number;
  int: number;
  spi: number;
  sta: number;
  health: number;
  mana: number;
  meleeAttack: number;
  rangedAttack: number;
  spellPower: number;
  healPower: number;
  defense: number;
  resist: number;
  moveSpeed: number;
  skillSpeed: number;
  proficiency: number;
  parry: number;
  dodge: number;
  block: number;
  tacticalReadiness: number;
  manaRegen: number;
  healthRegen: number;
  critChanceMelee: number;
  critChanceRanged: number;
  critChanceSpell: number;
  critChanceHeal: number;
  pvpResist: number;
  critDamageResist: number;
};

export function computeDerivedStats(
  bonus: EquippedBonuses,
  heroicLevel: number,
): DerivedStats {
  const base = BASE_CHARACTER_STATS;
  const str = base.str + bonus.str;
  const dex = base.dex + bonus.dex;
  const int = base.int + bonus.int;
  const spi = base.spi + bonus.spi;
  const sta = base.sta + bonus.sta;

  return {
    str,
    dex,
    int,
    spi,
    sta,
    meleeAttack: str * 0.25 + bonus.meleeAttack,
    rangedAttack: dex * 0.25 + bonus.rangedAttack,
    spellPower: int * 0.25 + bonus.spellPower,
    healPower: spi * 0.25 + bonus.healPower,
    mana: FLAT_MANA_POOL + int * 10 + bonus.mana,
    health: FLAT_HEALTH_POOL + sta * 12 + bonus.health,
    defense: sta * 1 + bonus.defense,
    resist: sta * 1 + bonus.resist,
    moveSpeed: base.moveSpeed + bonus.moveSpeed,
    skillSpeed:
      100 - computeSkillTimeReduction(int + spi) * 100 + bonus.skillSpeed,
    proficiency: base.proficiency + bonus.proficiency,
    parry: computeParry(str) * 100 + bonus.parry,
    dodge: computeDodge(dex) * 100 + bonus.dodge,
    block: computeBlock(sta) * 100 + bonus.block,
    tacticalReadiness:
      computeTacticalReadiness(str + dex) + bonus.tacticalReadiness,
    manaRegen: computeManaRegen(spi),
    healthRegen: computeHealthRegen(sta),
    critChanceMelee: computeCritChance(str, heroicLevel),
    critChanceRanged: computeCritChance(dex, heroicLevel),
    critChanceSpell: computeCritChance(int, heroicLevel),
    critChanceHeal: computeCritChance(spi, heroicLevel),
    pvpResist: bonus.pvpResist,
    critDamageResist: bonus.critDamageResist,
  };
}
