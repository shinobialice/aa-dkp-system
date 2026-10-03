import { Fragment } from "react";
import type { UserEquipment } from "@/actions/getUserEquipment";
import { RuneIcon } from "../../RuneIcon";
import { findRune } from "../../itemsData/runes";
import { getEngravingSlotCount } from "../../itemsData/engravingSlots";
import { EffectText } from "../../highlightNumbers";
import EngravingDisplay from "./EngravingDisplay";
import SynthesisDisplay from "./SynthesisDisplay";
import { synthesisBlocks } from "./synthesisLines";

type Props = {
  slotKey: string;
  item: UserEquipment;
  divided?: boolean;
};

export default function ItemDetails({ slotKey, item, divided }: Props) {
  const rune = item.rune_id ? findRune(item.rune_id) : undefined;
  const engravingCount = getEngravingSlotCount(slotKey, item.grade);
  const divider = divided && <div className="border-t border-border" />;

  return (
    <>
      {rune && (
        <>
          {divider}
          <div className="flex items-start gap-1.5">
            <RuneIcon rune={rune} size={20} />
            {rune.effect && (
              <div className="min-w-0 flex-1 space-y-0.5 text-xs text-green-500">
                <EffectText text={rune.effect} />
              </div>
            )}
          </div>
        </>
      )}
      {engravingCount > 0 && (
        <>
          {divider}
          <EngravingDisplay
            count={engravingCount}
            engravings={item.engravings}
          />
        </>
      )}
      {synthesisBlocks(slotKey, item).map((block, index) => (
        <Fragment key={index}>
          {divider}
          <SynthesisDisplay {...block} />
        </Fragment>
      ))}
    </>
  );
}
