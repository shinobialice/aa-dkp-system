import type { UserEquipment } from "@/actions/getUserEquipment";
import { findGearItem } from "./itemsData";
import {
  getSynthesisRolls,
  hasSynthesisGrowth,
  type SynthesisRoll,
} from "./itemsData/synthesis";
import { addStat, type StatBonuses } from "./itemsData/statEffects";

export function getEquipmentSynthesisRolls(eq: UserEquipment): SynthesisRoll[] {
  const gearItem = findGearItem(eq.slot, eq.item_name);
  if (!gearItem) return [];
  return getSynthesisRolls(
    gearItem.id,
    eq.grade,
    eq.synthesis_effects,
    eq.synthesis_percent,
  );
}

export function describeEquipmentSynthesis(eq: UserEquipment) {
  const gearItem = findGearItem(eq.slot, eq.item_name);
  const hasGrowth = !!gearItem && hasSynthesisGrowth(gearItem.id, eq.grade);
  return {
    title: hasGrowth
      ? `Эффекты синтеза (${eq.synthesis_percent}%)`
      : "Эффекты синтеза",
    rolls: getEquipmentSynthesisRolls(eq),
  };
}

export function computeSynthesisBonuses(
  equipment: UserEquipment[],
): StatBonuses {
  const bonuses: StatBonuses = new Map();
  for (const eq of equipment) {
    for (const { effect, value } of getEquipmentSynthesisRolls(eq)) {
      addStat(bonuses, effect.label, value);
    }
  }
  return bonuses;
}
