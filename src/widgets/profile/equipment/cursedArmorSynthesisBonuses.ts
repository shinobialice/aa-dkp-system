import type { UserEquipment } from "@/actions/getUserEquipment";
import { findCursedArmorSynthesisEffect } from "./itemsData/cursedArmorSynthesis";

export function computeCursedArmorSynthesisBonuses(
  equipment: UserEquipment[],
): Map<string, number> {
  const totals = new Map<string, number>();

  for (const eq of equipment) {
    for (const id of eq.cursed_synthesis_effects ?? []) {
      const effect = findCursedArmorSynthesisEffect(id);
      if (!effect) continue;
      totals.set(effect.label, (totals.get(effect.label) ?? 0) + effect.value);
    }
  }

  return totals;
}
