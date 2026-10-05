import type { EquipmentInput } from "@/actions/saveUserEquipment";
import type { UserEquipment } from "@/actions/getUserEquipment";
import { EQUIPMENT_SLOTS } from "../equipmentData";
import { findGearItem } from "../itemsData";
import {
  DEFAULT_ENCHANT,
  DEFAULT_EXTRA_PROTECTION,
  getMaxEnchant,
} from "../itemsData/statsFormula";
import { getEngravingSlotCount } from "../itemsData/engravingSlots";
import { isTwoHandedMainWeapon } from "../itemsData/weaponHandedness";
import { DEFAULT_GRADE } from "./slotLayout";

export type SlotValues = Omit<EquipmentInput, "slot" | "epheSealLevel">;

export const EMPTY_SLOT_VALUES: SlotValues = {
  itemName: "",
  grade: DEFAULT_GRADE,
  enchant: DEFAULT_ENCHANT,
  extraProtection: DEFAULT_EXTRA_PROTECTION,
  engravings: [],
  runeId: 0,
  synthesisEffects: [],
  synthesisPercent: 0,
};

function toSlotValues(
  slotKey: string,
  item: UserEquipment | undefined,
): SlotValues {
  if (!item) return EMPTY_SLOT_VALUES;
  const gearItem = findGearItem(slotKey, item.item_name);
  return {
    itemName: item.item_name ?? "",
    grade: item.grade,
    enchant: Math.min(item.enchant, getMaxEnchant(gearItem?.id)),
    extraProtection: item.extra_protection,
    engravings: item.engravings.slice(
      0,
      getEngravingSlotCount(slotKey, item.grade),
    ),
    runeId: item.rune_id,
    synthesisEffects: item.synthesis_effects,
    synthesisPercent: item.synthesis_percent,
  };
}

export function isSlotLocked(slotKey: string, equipment: UserEquipment[]) {
  const mainHand = equipment.find((item) => item.slot === "weapon_main");
  return slotKey === "weapon_off" && isTwoHandedMainWeapon(mainHand?.item_name);
}

export function buildEquipmentPayload(
  equipmentBySlot: Record<string, UserEquipment | undefined>,
  slotKey: string,
  values: SlotValues,
): EquipmentInput[] {
  const valuesFor = (key: string) =>
    key === slotKey ? values : toSlotValues(key, equipmentBySlot[key]);
  const isOffHandBlocked = isTwoHandedMainWeapon(
    valuesFor("weapon_main").itemName,
  );

  return EQUIPMENT_SLOTS.map((slot) => {
    const isBlocked = slot.key === "weapon_off" && isOffHandBlocked;
    return {
      slot: slot.key,
      ...(isBlocked ? EMPTY_SLOT_VALUES : valuesFor(slot.key)),
      epheSealLevel: equipmentBySlot[slot.key]?.ephe_seal_level ?? 0,
    };
  });
}
