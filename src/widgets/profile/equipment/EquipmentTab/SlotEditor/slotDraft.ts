import type { UserEquipment } from "@/actions/getUserEquipment";
import { findGearItem } from "../../itemsData";
import {
  DEFAULT_ENCHANT,
  DEFAULT_EXTRA_PROTECTION,
} from "../../itemsData/statsFormula";
import { NO_SYNTHESIS_EFFECT } from "../../itemsData/synthesis";
import { DEFAULT_GRADE, getFixedGrade } from "../slotLayout";
import type { SlotValues } from "../slotValues";
import type { SlotOptions } from "./slotOptions";

export type SlotDraft = {
  itemName: string;
  grade: number;
  enchant: number;
  extraProtection: number;
  engravings: number[];
  selectedEngravingId: number;
  runeId: number;
  synthesisEffects: number[];
  synthesisPercent: number;
};

const EMPTY_DRAFT: SlotDraft = {
  itemName: "",
  grade: DEFAULT_GRADE,
  enchant: DEFAULT_ENCHANT,
  extraProtection: DEFAULT_EXTRA_PROTECTION,
  engravings: [],
  selectedEngravingId: 0,
  runeId: 0,
  synthesisEffects: [],
  synthesisPercent: 0,
};

export function draftFromItem(
  slotKey: string,
  item: UserEquipment | undefined,
): SlotDraft {
  if (!item) return EMPTY_DRAFT;
  const gearItem = findGearItem(slotKey, item.item_name);
  const fixedGrade = gearItem
    ? getFixedGrade(gearItem.name, gearItem.grade)
    : null;

  return {
    itemName: item.item_name ?? "",
    grade: fixedGrade ?? item.grade,
    enchant: item.enchant,
    extraProtection: item.extra_protection,
    engravings: item.engravings,
    selectedEngravingId: item.engravings.find(Boolean) ?? 0,
    runeId: item.rune_id,
    synthesisEffects: item.synthesis_effects,
    synthesisPercent: item.synthesis_percent,
  };
}

export function draftToValues(
  slotKey: string,
  draft: SlotDraft,
  options: SlotOptions,
): SlotValues {
  return {
    itemName: draft.itemName,
    grade: draft.grade,
    enchant: draft.enchant,
    extraProtection: draft.extraProtection,
    engravings: draft.engravings.slice(0, options.maxEngravingSlots),
    runeId: draft.runeId,
    synthesisEffects: chosenSynthesisEffects(draft.synthesisEffects, options),
    synthesisPercent: options.hasSynthesisGrowth ? draft.synthesisPercent : 0,
  };
}

export function draftToPreviewItem(
  slotKey: string,
  item: UserEquipment | undefined,
  draft: SlotDraft,
  options: SlotOptions,
): UserEquipment {
  const values = draftToValues(slotKey, draft, options);
  return {
    id: item?.id ?? 0,
    user_id: item?.user_id ?? 0,
    ephe_seal_level: item?.ephe_seal_level ?? 0,
    slot: slotKey,
    item_name: values.itemName,
    grade: values.grade,
    enchant: values.enchant,
    extra_protection: values.extraProtection,
    engravings: values.engravings,
    rune_id: values.runeId,
    synthesis_effects: values.synthesisEffects,
    synthesis_percent: values.synthesisPercent,
  };
}

function chosenSynthesisEffects(effects: number[], options: SlotOptions) {
  const chosen = options.synthesisSlots.map((slotOptions, slot) => {
    const code = effects[slot] ?? NO_SYNTHESIS_EFFECT;
    return slotOptions.some((roll) => roll.code === code)
      ? code
      : NO_SYNTHESIS_EFFECT;
  });
  while (chosen.at(-1) === NO_SYNTHESIS_EFFECT) chosen.pop();
  return chosen;
}
