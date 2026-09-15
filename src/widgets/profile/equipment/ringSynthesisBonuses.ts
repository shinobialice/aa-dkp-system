import type { UserEquipment } from "@/actions/getUserEquipment";
import { findRingSynthesisEffect } from "./itemsData/ringSynthesis";

export function computeRingSynthesisBonuses(
  equipment: UserEquipment[],
): Map<string, number> {
  const totals = new Map<string, number>();

  for (const eq of equipment) {
    for (const id of eq.ring_synthesis_effects ?? []) {
      const effect = findRingSynthesisEffect(id);
      if (!effect) continue;
      totals.set(effect.label, (totals.get(effect.label) ?? 0) + effect.value);
    }
  }

  return totals;
}
