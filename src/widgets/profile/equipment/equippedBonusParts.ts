import type { UserEquipment } from "@/actions/getUserEquipment";
import type { UserSeal } from "@/actions/getUserSeals";
import { computeSealBonusSummary } from "@/widgets/profile/seals/sealBonusSummary";
import { ITEM_STATS, findGearItem } from "./itemsData";
import { getItemGradeStats } from "./itemsData/itemGradeStats";
import { scaleStat } from "./itemsData/statsFormula";
import { computeEngravingBonuses, ENGRAVING_STAT } from "./engravingBonuses";
import { computeCostumeSynthesisBonuses } from "./costumeSynthesisBonuses";
import { computeUnderwearSynthesisBonuses } from "./underwearSynthesisBonuses";
import { computeCursedArmorSynthesisBonuses } from "./cursedArmorSynthesisBonuses";
import { computeRingSynthesisBonuses } from "./ringSynthesisBonuses";
import { computeEphenRuneSetBonuses } from "./ephenRuneSetBonus";
import {
  computeEpheSealsFlatBonus,
  getEpheArmorMultiplier,
} from "../ephe/epheSealsBonus";
import { type EquippedBonuses } from "./characterStats";

export const EMPTY_BONUSES: EquippedBonuses = {
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
};

export const ATTRIBUTES = ["str", "int", "dex", "spi", "sta"] as const;

export const FLAT_STAT_TARGETS: [keyof EquippedBonuses, string][] = [
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
];

export function addGearStats(totals: EquippedBonuses, eq: UserEquipment) {
  const gearItem = findGearItem(eq.slot, eq.item_name);
  if (!gearItem) return;
  const gradeStats = getItemGradeStats(gearItem.id, eq.grade);
  const base = gradeStats ?? ITEM_STATS[gearItem.id];
  if (!base) return;

  // Статы из ITEM_GRADE_STATS уже финальные для грейда, scaleStat к ним не применяется.
  const stat = (key: string): number => {
    const value = base[key];
    if (value === undefined) return 0;
    return gradeStats
      ? value
      : scaleStat(value, eq.grade, eq.enchant ?? 0, key);
  };

  const armorMultiplier = getEpheArmorMultiplier(eq);
  totals.defense += stat("wearable_armor") * armorMultiplier;
  totals.resist += stat("wearable_magic_resistance") * armorMultiplier;
  for (const attribute of ATTRIBUTES) totals[attribute] += stat(attribute);
  totals.sta += base.flat_sta ?? 0;
  totals.spi += base.flat_spi ?? 0;
  totals.skillSpeed += base.skill_speed ?? 0;
  totals.tacticalReadiness += base.tactical_readiness ?? 0;
}

export function collectFlatBonuses(
  equipment: UserEquipment[],
  seals: UserSeal[],
  ephenSynthesisStats: Iterable<[string, number]>,
) {
  const flat = computeEngravingBonuses(equipment);
  const add = (entries: Iterable<[string, number]>) => {
    for (const [label, value] of entries) {
      flat.set(label, (flat.get(label) ?? 0) + value);
    }
  };
  add(computeCostumeSynthesisBonuses(equipment));
  add(computeUnderwearSynthesisBonuses(equipment));
  add(computeCursedArmorSynthesisBonuses(equipment));
  add(computeRingSynthesisBonuses(equipment));
  add(computeEphenRuneSetBonuses(equipment));
  add(ephenSynthesisStats);
  const sealPicks = seals.map((seal) => ({
    sealName: seal.seal_name,
    level: seal.level,
  }));
  add(
    computeSealBonusSummary(sealPicks).map(
      ({ stat, value }) => [stat, value] as [string, number],
    ),
  );
  add(computeEpheSealsFlatBonus(equipment));
  return flat;
}
