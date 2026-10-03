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
  costumeSynthesisEffects: [],
  underwearSynthesisEffects: [],
  cursedSynthesisEffects: [],
  ringSynthesisEffects: [],
  ephenSynthesisPercent: 0,
  ephenSynthesisPrimary: "",
  ephenSynthesisSecondary: "",
  ephenSynthesisTertiary: [],
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
    costumeSynthesisEffects: item.costume_synthesis_effects,
    underwearSynthesisEffects: item.underwear_synthesis_effects,
    cursedSynthesisEffects: item.cursed_synthesis_effects,
    ringSynthesisEffects: item.ring_synthesis_effects,
    ephenSynthesisPercent: item.ephen_synthesis_percent,
    ephenSynthesisPrimary: item.ephen_synthesis_primary,
    ephenSynthesisSecondary: item.ephen_synthesis_secondary,
    ephenSynthesisTertiary: item.ephen_synthesis_tertiary,
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
