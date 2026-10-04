import type { UserEquipment } from "@/actions/getUserEquipment";
import { findGearItem } from "../equipment/itemsData";
import { getEpheItemTier } from "./epheItemTiers";
import {
  EPHE_SLOT_TRACK,
  EPHE_TRACK_PERCENT_CATEGORY,
  getEpheEffectiveness,
  getEpheTrackLevels,
  getEphePercentBonus,
} from "./epheSealsData";

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

export type EpheStatMultipliers = Partial<Record<string, number>>;

const EPHE_PERCENT_STATS: [stat: string, category: "weapon" | "armor"][] = [
  ["weapon_dps", "weapon"],
  ["weapon_magic_power", "weapon"],
  ["weapon_heal_power", "weapon"],
  ["wearable_armor", "armor"],
  ["wearable_magic_resistance", "armor"],
];

export function getEpheStatMultipliers(eq: UserEquipment): EpheStatMultipliers {
  const track = EPHE_SLOT_TRACK[eq.slot];
  if (!track || eq.ephe_seal_level <= 0) return {};
  const category = EPHE_TRACK_PERCENT_CATEGORY[track];
  if (!category) return {};
  const gearItem = findGearItem(eq.slot, eq.item_name);
  if (!gearItem) return {};
  const effectiveness = getEpheEffectiveness(track, eq.ephe_seal_level);
  if (effectiveness <= 0) return {};
  const tier = getEpheItemTier(gearItem.id);
  // Печать на слоте оружия усиливает и защиту щита, но по кривой доспехов.
  return Object.fromEntries(
    EPHE_PERCENT_STATS.map(([stat, statCategory]) => [
      stat,
      1 + getEphePercentBonus(statCategory, tier, effectiveness) / 100,
    ]),
  );
}
