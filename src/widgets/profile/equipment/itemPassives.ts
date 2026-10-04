import type { UserEquipment } from "@/actions/getUserEquipment";
import { findGearItem } from "./itemsData";
import { GAME_ITEM_PASSIVES } from "./itemsData/gameItemPassives";
import type { SynthesisRoll } from "./itemsData/synthesis";
import {
  addStat,
  signedEffectValue,
  STAT_EFFECTS,
  type StatBonuses,
} from "./itemsData/statEffects";

export function getItemPassiveRolls(itemId: number): SynthesisRoll[] {
  return Object.entries(GAME_ITEM_PASSIVES[itemId] ?? {}).flatMap(
    ([code, value]) => {
      const effect = STAT_EFFECTS[Number(code)];
      if (!effect) return [];
      return [
        { code: Number(code), effect, value: signedEffectValue(effect, value) },
      ];
    },
  );
}

export function computeItemPassiveBonuses(
  equipment: UserEquipment[],
): StatBonuses {
  const bonuses: StatBonuses = new Map();
  for (const eq of equipment) {
    const gearItem = findGearItem(eq.slot, eq.item_name);
    if (!gearItem) continue;
    for (const { effect, value } of getItemPassiveRolls(gearItem.id)) {
      addStat(bonuses, effect.label, value);
    }
  }
  return bonuses;
}
