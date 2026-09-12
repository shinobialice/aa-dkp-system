import type { GearItem } from "./types";
import { HEAD_ITEMS } from "./head";
import { CHEST_ITEMS } from "./chest";
import { BELT_ITEMS } from "./belt";
import { BRACERS_ITEMS } from "./bracers";
import { HANDS_ITEMS } from "./hands";
import { LEGS_ITEMS } from "./legs";
import { FEET_ITEMS } from "./feet";
import { CLOAK_ITEMS } from "./cloak";
import { UNDERWEAR_ITEMS } from "./underwear";
import { COSTUME_ITEMS } from "./costume";
import { INSTRUMENT_ITEMS } from "./instrument";
import { NECKLACE_ITEMS } from "./necklace";
import { EARRING_ITEMS } from "./earring";
import { RING_ITEMS } from "./ring";
import { WEAPON_MAIN_ITEMS } from "./weapon_main";
import { WEAPON_OFF_ITEMS } from "./weapon_off";
import { WEAPON_RANGED_ITEMS } from "./weapon_ranged";
import { ITEM_STATS } from "./stats";

export type { GearItem };
export { ITEM_STATS };
export const ITEMS_BY_SLOT: Record<string, GearItem[]> = {
  head: HEAD_ITEMS,
  chest: CHEST_ITEMS,
  belt: BELT_ITEMS,
  bracers: BRACERS_ITEMS,
  hands: HANDS_ITEMS,
  legs: LEGS_ITEMS,
  feet: FEET_ITEMS,
  cloak: CLOAK_ITEMS,
  underwear: UNDERWEAR_ITEMS,
  costume: COSTUME_ITEMS,
  instrument: INSTRUMENT_ITEMS,
  necklace: NECKLACE_ITEMS,
  earring1: EARRING_ITEMS,
  earring2: EARRING_ITEMS,
  ring1: RING_ITEMS,
  ring2: RING_ITEMS,
  weapon_main: WEAPON_MAIN_ITEMS,
  weapon_off: WEAPON_OFF_ITEMS,
  weapon_ranged: WEAPON_RANGED_ITEMS,
};

export function findGearItem(
  slotKey: string,
  itemName: string | null | undefined,
): GearItem | undefined {
  if (!itemName) return undefined;
  return ITEMS_BY_SLOT[slotKey]?.find((i) => i.name === itemName);
}
