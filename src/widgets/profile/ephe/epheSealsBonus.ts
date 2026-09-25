import type { UserEquipment } from "@/actions/getUserEquipment";
import { findGearItem } from "../equipment/itemsData";
import { getEphenSynthesisCategoryKey } from "../equipment/itemsData/ephenSynthesis";
import {
  EPHE_SLOT_TRACK,
  getEpheEffectiveness,
  getEpheTrackLevels,
  getEphePercentBonus,
  type EpheItemTier,
} from "./epheSealsData";

export function getEpheItemTier(itemId: number): EpheItemTier {
  const key = getEphenSynthesisCategoryKey(itemId);
  if (!key) return "default";
  return key.startsWith("ramian_") ? "ramian" : "ephen";
}

export function computeEpheSealsFlatBonus(
  equipment: UserEquipment[],
): Map<string, number> {
  const bonus = new Map<string, number>();
  for (const eq of equipment) {
    const track = EPHE_SLOT_TRACK[eq.slot];
    if (!track || eq.ephe_seal_level <= 0) continue;
    for (const row of getEpheTrackLevels(track)) {
      if (row.level > eq.ephe_seal_level) break;
      if (row.type === "milestone") {
        bonus.set(row.stat, (bonus.get(row.stat) ?? 0) + row.value);
      }
    }
  }
  return bonus;
}

export function getEpheArmorMultiplier(eq: UserEquipment): number {
  const track = EPHE_SLOT_TRACK[eq.slot];
  if (!track || eq.ephe_seal_level <= 0) return 1;
  const gearItem = findGearItem(eq.slot, eq.item_name);
  if (!gearItem) return 1;
  const effectiveness = getEpheEffectiveness(track, eq.ephe_seal_level);
  if (effectiveness <= 0) return 1;
  const tier = getEpheItemTier(gearItem.id);
  const percent = getEphePercentBonus("armor", tier, effectiveness);
  return 1 + percent / 100;
}
