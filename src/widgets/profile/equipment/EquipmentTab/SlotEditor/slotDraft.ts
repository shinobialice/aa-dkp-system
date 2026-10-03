import type { UserEquipment } from "@/actions/getUserEquipment";
import { findGearItem } from "../../itemsData";
import {
  DEFAULT_ENCHANT,
  DEFAULT_EXTRA_PROTECTION,
} from "../../itemsData/statsFormula";
import { RING_SYNTHESIS_SLOT_COUNT } from "../../itemsData/ringSynthesis";
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
  cursedSynthesisEffects: number[];
  ringSynthesisEffects: number[];
  ephenSynthesisPercent: number;
  ephenSynthesisPrimary: string;
  ephenSynthesisSecondary: string;
  ephenSynthesisTertiary: string[];
};

const NO_CURSED_EFFECT = -1;

export function slotSynthesisEffects(
  slotKey: string,
  item: UserEquipment | undefined,
) {
  if (slotKey === "costume") return item?.costume_synthesis_effects ?? [];
  if (slotKey === "underwear") return item?.underwear_synthesis_effects ?? [];
  return [];
}

const EMPTY_DRAFT: SlotDraft = {
  itemName: "",
  grade: DEFAULT_GRADE,
  enchant: DEFAULT_ENCHANT,
  extraProtection: DEFAULT_EXTRA_PROTECTION,
  engravings: [],
  selectedEngravingId: 0,
  runeId: 0,
  synthesisEffects: [],
  cursedSynthesisEffects: [],
  ringSynthesisEffects: [],
  ephenSynthesisPercent: 0,
  ephenSynthesisPrimary: "",
  ephenSynthesisSecondary: "",
  ephenSynthesisTertiary: [],
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
    synthesisEffects: slotSynthesisEffects(slotKey, item),
    cursedSynthesisEffects: item.cursed_synthesis_effects,
    ringSynthesisEffects: item.ring_synthesis_effects,
    ephenSynthesisPercent: item.ephen_synthesis_percent,
    ephenSynthesisPrimary: item.ephen_synthesis_primary,
    ephenSynthesisSecondary: item.ephen_synthesis_secondary,
    ephenSynthesisTertiary: item.ephen_synthesis_tertiary,
  };
}

export function draftToValues(
  slotKey: string,
  draft: SlotDraft,
  options: SlotOptions,
): SlotValues {
  const synthesis = draft.synthesisEffects.slice(0, options.maxSynthesisSlots);
  const ephen = options.ephenEligible;

  return {
    itemName: draft.itemName,
    grade: draft.grade,
    enchant: draft.enchant,
    extraProtection: draft.extraProtection,
    engravings: draft.engravings.slice(0, options.maxEngravingSlots),
    runeId: draft.runeId,
    costumeSynthesisEffects: slotKey === "costume" ? synthesis : [],
    underwearSynthesisEffects: slotKey === "underwear" ? synthesis : [],
    cursedSynthesisEffects: chosenCursedEffects(
      draft.cursedSynthesisEffects,
      options.cursedSynthesisPools.length,
    ),
    ringSynthesisEffects: options.isRingSynthesis
      ? draft.ringSynthesisEffects.slice(0, RING_SYNTHESIS_SLOT_COUNT)
      : [],
    ephenSynthesisPercent: ephen ? draft.ephenSynthesisPercent : 0,
    ephenSynthesisPrimary: ephen ? draft.ephenSynthesisPrimary : "",
    ephenSynthesisSecondary: ephen ? draft.ephenSynthesisSecondary : "",
    ephenSynthesisTertiary: ephen ? draft.ephenSynthesisTertiary : [],
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
    costume_synthesis_effects:
      slotKey === "costume" ? draft.synthesisEffects : [],
    underwear_synthesis_effects:
      slotKey === "underwear" ? draft.synthesisEffects : [],
    cursed_synthesis_effects: draft.cursedSynthesisEffects.filter(
      (id) => id >= 0,
    ),
    ring_synthesis_effects: options.isRingSynthesis
      ? draft.ringSynthesisEffects
      : [],
    ephen_synthesis_percent: values.ephenSynthesisPercent,
    ephen_synthesis_primary: values.ephenSynthesisPrimary,
    ephen_synthesis_secondary: values.ephenSynthesisSecondary,
    ephen_synthesis_tertiary: values.ephenSynthesisTertiary,
  };
}

function chosenCursedEffects(effects: number[], poolCount: number) {
  const chosen: number[] = [];
  for (const value of effects.slice(0, poolCount)) {
    if (value === NO_CURSED_EFFECT) break;
    chosen.push(value);
  }
  return chosen;
}
