import { findGearItem } from "../../itemsData";
import { getEngravingSlotCount } from "../../itemsData/engravingSlots";
import {
  getCostumeRole,
  getCostumeSynthesisEffectsForRole,
  getCostumeSynthesisSlotCount,
} from "../../itemsData/costumeSynthesis";
import {
  getUnderwearRole,
  getUnderwearSynthesisEffectsForRole,
  getUnderwearSynthesisSlotCount,
} from "../../itemsData/underwearSynthesis";
import { getCursedArmorSynthesisSlotPools } from "../../itemsData/cursedArmorSynthesis";
import { isRingSynthesisItem } from "../../itemsData/ringSynthesis";
import { getEphenSynthesisCategory } from "../../itemsData/ephenSynthesis";
import { WEAPON_HANDEDNESS } from "../../itemsData/weaponHandedness";
import { getFixedGrade } from "../slotLayout";
import type { SlotDraft } from "./slotDraft";

export type SlotOptions = ReturnType<typeof deriveSlotOptions>;

export function deriveSlotOptions(slotKey: string, draft: SlotDraft) {
  const gearItem = findGearItem(slotKey, draft.itemName);
  const ephenCategory = gearItem
    ? getEphenSynthesisCategory(gearItem.id)
    : undefined;

  return {
    gearItem,
    fixedGrade: gearItem ? getFixedGrade(gearItem.name, gearItem.grade) : null,
    maxEngravingSlots: getEngravingSlotCount(slotKey, draft.grade),
    handedness: gearItem ? WEAPON_HANDEDNESS[gearItem.id] : undefined,
    hasSynthesisRole: synthesisEffectsFor(slotKey, draft.itemName).length > 0,
    maxSynthesisSlots: synthesisSlotCount(slotKey, draft.grade),
    synthesisEffectOptions: synthesisEffectsFor(slotKey, draft.itemName),
    cursedSynthesisPools: gearItem
      ? getCursedArmorSynthesisSlotPools(gearItem.id)
      : [],
    isRingSynthesis: !!gearItem && isRingSynthesisItem(gearItem.id),
    ephenCategory,
    ephenEligible: !!ephenCategory && draft.grade >= ephenCategory.minGrade,
  };
}

function synthesisSlotCount(slotKey: string, grade: number) {
  if (slotKey === "costume") return getCostumeSynthesisSlotCount(grade);
  if (slotKey === "underwear") return getUnderwearSynthesisSlotCount(grade);
  return 0;
}

function synthesisEffectsFor(slotKey: string, itemName: string) {
  if (slotKey === "costume") {
    const role = getCostumeRole(itemName);
    return role ? getCostumeSynthesisEffectsForRole(role) : [];
  }
  if (slotKey === "underwear") {
    const role = getUnderwearRole(itemName);
    return role ? getUnderwearSynthesisEffectsForRole(role) : [];
  }
  return [];
}
