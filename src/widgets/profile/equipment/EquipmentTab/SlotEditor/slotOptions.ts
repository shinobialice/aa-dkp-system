import { findGearItem } from "../../itemsData";
import { getEngravingSlotCount } from "../../itemsData/engravingSlots";
import { getMaxEnchant } from "../../itemsData/statsFormula";
import {
  getSynthesisSlotOptions,
  hasSynthesisGrowth,
} from "../../itemsData/synthesis";
import { WEAPON_HANDEDNESS } from "../../itemsData/weaponHandedness";
import { getFixedGrade } from "../slotLayout";
import type { SlotDraft } from "./slotDraft";

export type SlotOptions = ReturnType<typeof deriveSlotOptions>;

export function deriveSlotOptions(slotKey: string, draft: SlotDraft) {
  const gearItem = findGearItem(slotKey, draft.itemName);

  return {
    gearItem,
    fixedGrade: gearItem ? getFixedGrade(gearItem.name, gearItem.grade) : null,
    maxEngravingSlots: getEngravingSlotCount(slotKey, draft.grade),
    maxEnchant: getMaxEnchant(gearItem?.id),
    handedness: gearItem ? WEAPON_HANDEDNESS[gearItem.id] : undefined,
    synthesisSlots: gearItem
      ? getSynthesisSlotOptions(
          gearItem.id,
          draft.grade,
          draft.synthesisPercent,
        )
      : [],
    hasSynthesisGrowth:
      !!gearItem && hasSynthesisGrowth(gearItem.id, draft.grade),
  };
}
