import type { UserEquipment } from "@/actions/getUserEquipment";
import { findGearItem } from "../equipment/itemsData";
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

const WEAPON_PERCENT_STATS = [
  "weapon_dps",
  "weapon_magic_power",
  "weapon_heal_power",
];
const ARMOR_PERCENT_STATS = ["wearable_armor", "wearable_magic_resistance"];

export function getEpheStatMultipliers(eq: UserEquipment): EpheStatMultipliers {
  const track = EPHE_SLOT_TRACK[eq.slot];
  if (!track || eq.ephe_seal_level <= 0) return {};
  const category = EPHE_TRACK_PERCENT_CATEGORY[track];
  if (!category) return {};
  const gearItem = findGearItem(eq.slot, eq.item_name);
  if (!gearItem) return {};
  const effectiveness = getEpheEffectiveness(track, eq.ephe_seal_level);
  if (effectiveness <= 0) return {};
  const weaponMultiplier =
    1 + getEphePercentBonus("weapon", gearItem.id, effectiveness) / 100;
  const armorMultiplier =
    1 + getEphePercentBonus("armor", gearItem.id, effectiveness) / 100;
  return Object.fromEntries([
    ...WEAPON_PERCENT_STATS.map((stat) => [stat, weaponMultiplier]),
    ...ARMOR_PERCENT_STATS.map((stat) => [stat, armorMultiplier]),
  ]);
}
