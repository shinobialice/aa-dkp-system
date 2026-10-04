import type { UserEquipment } from "@/actions/getUserEquipment";
import type { UserSeal } from "@/actions/getUserSeals";
import type { RoleSkillBuild } from "@/actions/getUserSkillBuild";
import type { SelectedBuffs } from "./characterBuffs";
import { computePassiveBonuses } from "./skillPassiveBonuses";
import { addStat, STAT_LABEL, type StatBonuses } from "./itemsData/statEffects";
import { ENGRAVING_STAT } from "./engravingBonuses";
import { computeEquipmentBuffBonuses } from "./equipmentBuffBonuses";
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
  FLAT_STAT_TARGETS,
  addGearStats,
  collectStatSources,
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
  manaPercent: number;
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
  critChanceMelee: number;
  critChanceRanged: number;
  critChanceSpell: number;
  critChanceHeal: number;
  healthRegen: number;
  manaRegen: number;
};

// «Получаемый урон» в окне характеристик игры входит во все уязвимости, кроме PvE.
const DAMAGE_TAKEN_TARGETS = [
  ENGRAVING_STAT.MELEE_VULN,
  ENGRAVING_STAT.RANGED_VULN,
  ENGRAVING_STAT.SPELL_VULN,
  STAT_LABEL.SIEGE_VULN,
];

export type CharacterBonuses = {
  totals: EquippedBonuses;
  flat: StatBonuses;
};

export function computeCharacterBonuses(
  equipment: UserEquipment[],
  seals: UserSeal[] = [],
  buffs: SelectedBuffs = {},
  skillBuild: RoleSkillBuild = {},
): CharacterBonuses {
  const totals = { ...EMPTY_BONUSES };
  const flat: StatBonuses = new Map();
  for (const eq of equipment) addGearStats(totals, flat, eq);

  const equipmentBuffs = computeEquipmentBuffBonuses(equipment);
  const passives = computePassiveBonuses(skillBuild, equipment);
  const sources = [
    ...collectStatSources(equipment, seals, buffs),
    equipmentBuffs.stats,
    passives.stats,
  ];
  for (const source of sources) {
    for (const [label, value] of source) addStat(flat, label, value);
  }
  const damageTaken = flat.get(STAT_LABEL.DAMAGE_TAKEN) ?? 0;
  for (const label of DAMAGE_TAKEN_TARGETS) addStat(flat, label, damageTaken);

  for (const [key, label] of FLAT_STAT_TARGETS) {
    totals[key] += flat.get(label) ?? 0;
  }
  const defensePercent =
    equipmentBuffs.defensePercent + passives.defensePercent;
  const resistPercent = equipmentBuffs.resistPercent + passives.resistPercent;
  totals.defense *= 1 + defensePercent / 100;
  totals.resist *= 1 + resistPercent / 100;
  totals.manaPercent = passives.manaPercent;
  return { totals, flat };
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
    mana:
      (FLAT_MANA_POOL + int * 10 + bonus.mana) * (1 + bonus.manaPercent / 100),
    health: FLAT_HEALTH_POOL + sta * 12 + bonus.health,
    defense: sta * 1 + bonus.defense,
    resist: sta * 1 + bonus.resist,
    moveSpeed: base.moveSpeed * (1 + bonus.moveSpeed / 100),
    skillSpeed:
      100 - computeSkillTimeReduction(int + spi) * 100 + bonus.skillSpeed,
    proficiency: base.proficiency + bonus.proficiency,
    parry: computeParry(str) * 100 + bonus.parry,
    dodge: computeDodge(dex) * 100 + bonus.dodge,
    block: computeBlock(sta) * 100 + bonus.block,
    tacticalReadiness:
      computeTacticalReadiness(str + dex) + bonus.tacticalReadiness,
    manaRegen: computeManaRegen(spi) + bonus.manaRegen,
    healthRegen: computeHealthRegen(sta) + bonus.healthRegen,
    critChanceMelee:
      computeCritChance(str, heroicLevel) + bonus.critChanceMelee,
    critChanceRanged:
      computeCritChance(dex, heroicLevel) + bonus.critChanceRanged,
    critChanceSpell:
      computeCritChance(int, heroicLevel) + bonus.critChanceSpell,
    critChanceHeal: computeCritChance(spi, heroicLevel) + bonus.critChanceHeal,
    pvpResist: bonus.pvpResist,
    critDamageResist: bonus.critDamageResist,
  };
}
