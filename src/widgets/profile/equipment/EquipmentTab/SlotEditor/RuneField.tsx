import type { UserEquipment } from "@/actions/getUserEquipment";
import { RunePicker } from "../../RunePicker";
import { findRune } from "../../itemsData/runes";
import { EffectText } from "../../highlightNumbers";
import FieldLabel from "./FieldLabel";
import type { FieldProps } from "./fieldProps";

type Props = FieldProps & { equipment: UserEquipment[] };

export default function RuneField({
  slotKey,
  draft,
  options,
  onChange,
  equipment,
}: Props) {
  const rune = draft.runeId ? findRune(draft.runeId) : undefined;

  return (
    <div className="space-y-1.5">
      <FieldLabel>Лунный камень / руна</FieldLabel>
      <RunePicker
        slot={slotKey}
        handedness={options.handedness}
        itemId={options.gearItem?.id}
        value={draft.runeId}
        onSelect={(runeId) => onChange({ runeId })}
        equipment={equipment}
      />
      {rune?.effect && (
        <div className="space-y-0.5 text-xs text-green-500">
          <EffectText text={rune.effect} />
        </div>
      )}
    </div>
  );
}
