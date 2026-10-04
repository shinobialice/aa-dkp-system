import type { EquipmentInput } from "@/actions/saveUserEquipment";
import type { UserEquipment } from "@/actions/getUserEquipment";
import { EQUIPMENT_SLOTS } from "../equipmentData";
import {
  DEFAULT_ENCHANT,
  DEFAULT_EXTRA_PROTECTION,
} from "../itemsData/statsFormula";
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

function toSlotValues(item: UserEquipment | undefined): SlotValues {
  if (!item) return EMPTY_SLOT_VALUES;
  return {
    itemName: item.item_name ?? "",
    grade: item.grade,
    enchant: item.enchant,
    extraProtection: item.extra_protection,
    engravings: item.engravings,
    runeId: item.rune_id,
    synthesisEffects: item.synthesis_effects,
    synthesisPercent: item.synthesis_percent,
  };
}

export function buildEquipmentPayload(
  equipmentBySlot: Record<string, UserEquipment | undefined>,
  slotKey: string,
  values: SlotValues,
): EquipmentInput[] {
  return EQUIPMENT_SLOTS.map((slot) => {
    const existing = equipmentBySlot[slot.key];
    return {
      slot: slot.key,
      ...(slot.key === slotKey ? values : toSlotValues(existing)),
      epheSealLevel: existing?.ephe_seal_level ?? 0,
    };
  });
}
