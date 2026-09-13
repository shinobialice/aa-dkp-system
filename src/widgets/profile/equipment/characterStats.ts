import type { UserEquipment } from "@/actions/getUserEquipment";
import { ITEM_STATS, findGearItem } from "./itemsData";
import { scaleStat } from "./itemsData/statsFormula";
import { computeEngravingBonuses, ENGRAVING_STAT } from "./engravingBonuses";
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
};

export function computeEquippedBonuses(
  equipment: UserEquipment[],
): EquippedBonuses {
  const totals: EquippedBonuses = {
    defense: 0,
    resist: 0,
    str: 0,
    int: 0,
    dex: 0,
    spi: 0,
    sta: 0,
    health: 0,
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
  };

  for (const eq of equipment) {
    const gearItem = findGearItem(eq.slot, eq.item_name);
    if (!gearItem) continue;
    const base = ITEM_STATS[gearItem.id];
    if (!base) continue;

    const enchant = eq.enchant ?? 0;

    if (base.wearable_armor) {
      totals.defense += scaleStat(base.wearable_armor, eq.grade, enchant, "wearable_armor");
    }
    if (base.wearable_magic_resistance) {
      totals.resist += scaleStat(
        base.wearable_magic_resistance,
        eq.grade,
        enchant,
        "wearable_magic_resistance",
      );
    }
    if (base.str) totals.str += scaleStat(base.str, eq.grade, enchant, "str");
    if (base.int) totals.int += scaleStat(base.int, eq.grade, enchant, "int");
    if (base.dex) totals.dex += scaleStat(base.dex, eq.grade, enchant, "dex");
    if (base.spi) totals.spi += scaleStat(base.spi, eq.grade, enchant, "spi");
    if (base.sta) totals.sta += scaleStat(base.sta, eq.grade, enchant, "sta");
  }

  const engravingBonus = computeEngravingBonuses(equipment);
  totals.defense += engravingBonus.get(ENGRAVING_STAT.DEFENSE) ?? 0;
  totals.resist += engravingBonus.get(ENGRAVING_STAT.RESIST) ?? 0;
  totals.health += engravingBonus.get(ENGRAVING_STAT.HEALTH) ?? 0;
  totals.meleeAttack += engravingBonus.get(ENGRAVING_STAT.MELEE_ATTACK) ?? 0;
  totals.rangedAttack += engravingBonus.get(ENGRAVING_STAT.RANGED_ATTACK) ?? 0;
  totals.spellPower += engravingBonus.get(ENGRAVING_STAT.SPELL_POWER) ?? 0;
  totals.healPower += engravingBonus.get(ENGRAVING_STAT.HEAL_POWER) ?? 0;
  totals.moveSpeed += engravingBonus.get(ENGRAVING_STAT.MOVE_SPEED) ?? 0;
  totals.skillSpeed += engravingBonus.get(ENGRAVING_STAT.SKILL_SPEED) ?? 0;
  totals.proficiency += engravingBonus.get(ENGRAVING_STAT.PROFICIENCY) ?? 0;
  totals.tacticalReadiness +=
    engravingBonus.get(ENGRAVING_STAT.TACTICAL_READINESS) ?? 0;
  totals.parry += engravingBonus.get(ENGRAVING_STAT.PARRY) ?? 0;
  totals.dodge += engravingBonus.get(ENGRAVING_STAT.DODGE) ?? 0;
  totals.block += engravingBonus.get(ENGRAVING_STAT.BLOCK) ?? 0;

  return totals;
}

const FLAT_HEALTH_POOL =
  BASE_CHARACTER_STATS.health - BASE_CHARACTER_STATS.sta * 12;
const FLAT_MANA_POOL = BASE_CHARACTER_STATS.mana - BASE_CHARACTER_STATS.int * 10;

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
    mana: FLAT_MANA_POOL + int * 10,
    health: FLAT_HEALTH_POOL + sta * 12 + bonus.health,
    defense: sta * 1 + bonus.defense,
    resist: sta * 1 + bonus.resist,
    moveSpeed: base.moveSpeed + bonus.moveSpeed,
    skillSpeed: 100 - computeSkillTimeReduction(int + spi) * 100 + bonus.skillSpeed,
    proficiency: base.proficiency + bonus.proficiency,
    parry: computeParry(str) * 100 + bonus.parry,
    dodge: computeDodge(dex) * 100 + bonus.dodge,
    block: computeBlock(sta) * 100 + bonus.block,
    tacticalReadiness: computeTacticalReadiness(str + dex) + bonus.tacticalReadiness,
    manaRegen: computeManaRegen(spi),
    healthRegen: computeHealthRegen(sta),
    critChanceMelee: computeCritChance(str, heroicLevel),
    critChanceRanged: computeCritChance(dex, heroicLevel),
    critChanceSpell: computeCritChance(int, heroicLevel),
    critChanceHeal: computeCritChance(spi, heroicLevel),
  };
}
