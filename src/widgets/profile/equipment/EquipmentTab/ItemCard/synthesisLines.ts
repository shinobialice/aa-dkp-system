import type { UserEquipment } from "@/actions/getUserEquipment";
import { findCostumeSynthesisEffect } from "../../itemsData/costumeSynthesis";
import { findUnderwearSynthesisEffect } from "../../itemsData/underwearSynthesis";
import { findCursedArmorSynthesisEffect } from "../../itemsData/cursedArmorSynthesis";
import { findRingSynthesisEffect } from "../../itemsData/ringSynthesis";
import {
  getEphenSynthesisRolls,
  hasEphenSynthesisSelection,
} from "../../ephenSynthesisBonus";
import { slotSynthesisEffects } from "../SlotEditor/slotDraft";
import type { SynthesisLine } from "./SynthesisDisplay";

type EffectFinder = (
  id: number,
) => { label: string; value: number; isPercent: boolean } | undefined;

export type SynthesisBlock = {
  title: string;
  lines: SynthesisLine[];
  showPlus?: boolean;
};

const SYNTHESIS_TITLE = "Эффекты синтеза";

function linesFor(ids: number[], find: EffectFinder): SynthesisLine[] {
  return ids.flatMap((id) => {
    const effect = find(id);
    return effect ? [{ key: id, ...effect }] : [];
  });
}

export function synthesisBlocks(
  slotKey: string,
  item: UserEquipment,
): SynthesisBlock[] {
  const slotFinder =
    slotKey === "costume"
      ? findCostumeSynthesisEffect
      : findUnderwearSynthesisEffect;
  const blocks: SynthesisBlock[] = [
    {
      title: SYNTHESIS_TITLE,
      lines: linesFor(slotSynthesisEffects(slotKey, item), slotFinder),
    },
    {
      title: SYNTHESIS_TITLE,
      lines: linesFor(
        item.cursed_synthesis_effects,
        findCursedArmorSynthesisEffect,
      ),
    },
    {
      title: SYNTHESIS_TITLE,
      lines: linesFor(item.ring_synthesis_effects, findRingSynthesisEffect),
    },
  ];
  if (hasEphenSynthesisSelection(item)) {
    blocks.push({
      title: `Эффект синтеза (${item.ephen_synthesis_percent}%)`,
      lines: getEphenSynthesisRolls(item),
      showPlus: true,
    });
  }
  return blocks.filter((block) => block.lines.length > 0);
}
