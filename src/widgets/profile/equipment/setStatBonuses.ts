import type { UserEquipment } from "@/actions/getUserEquipment";
import { findGearItem } from "./itemsData";
import { GAME_SET_BONUSES } from "./itemsData/gameSetBonuses";
import { NAMED_SETS } from "./itemsData/namedSets";
import {
  addStat,
  signedEffectValue,
  STAT_EFFECTS,
  type StatBonuses,
} from "./itemsData/statEffects";

export function computeSetStatBonuses(equipment: UserEquipment[]): StatBonuses {
  const bonuses: StatBonuses = new Map();
  const equippedIds = new Set(
    equipment.flatMap((eq) => findGearItem(eq.slot, eq.item_name)?.id ?? []),
  );
  for (const set of NAMED_SETS) {
    const steps = GAME_SET_BONUSES[set.id];
    if (!steps) continue;
    const ownedCount = set.itemIds.filter((id) => equippedIds.has(id)).length;
    for (const [pieces, stats] of Object.entries(steps)) {
      if (ownedCount >= Number(pieces)) addStepStats(bonuses, stats);
    }
  }
  return bonuses;
}

function addStepStats(bonuses: StatBonuses, stats: Record<number, number>) {
  for (const [code, value] of Object.entries(stats)) {
    const effect = STAT_EFFECTS[Number(code)];
    if (effect) {
      addStat(bonuses, effect.label, signedEffectValue(effect, value));
    }
  }
}
