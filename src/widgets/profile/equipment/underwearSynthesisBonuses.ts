import type { UserEquipment } from "@/actions/getUserEquipment";
import { findUnderwearSynthesisEffect } from "./itemsData/underwearSynthesis";

export function computeUnderwearSynthesisBonuses(
  equipment: UserEquipment[],
): Map<string, number> {
  const totals = new Map<string, number>();

  for (const eq of equipment) {
    for (const id of eq.underwear_synthesis_effects ?? []) {
      const effect = findUnderwearSynthesisEffect(id);
      if (!effect) continue;
      totals.set(effect.label, (totals.get(effect.label) ?? 0) + effect.value);
    }
  }

  return totals;
}
