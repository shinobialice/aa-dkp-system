import {
  MAX_ENCHANT,
  getMaxExtraProtectionLevel,
  isValidEnchantLevel,
  isValidExtraProtectionLevel,
} from "../../itemsData/statsFormula";
import Stepper from "./Stepper";
import type { FieldProps } from "./fieldProps";

export default function EnchantFields({
  slotKey,
  draft,
  onChange,
}: FieldProps) {
  const maxProtection = getMaxExtraProtectionLevel(slotKey);

  return (
    <div className="grid grid-cols-2 gap-3">
      <Stepper
        label="Куб"
        hint={`макс. ${MAX_ENCHANT}`}
        value={draft.enchant}
        max={MAX_ENCHANT}
        format={(value) => `+${value}`}
        onChange={(value) => {
          if (isValidEnchantLevel(value)) onChange({ enchant: value });
        }}
        showMax
      />
      <Stepper
        label="Защита от доп. урона"
        hint={`ур. 0–${maxProtection}`}
        value={draft.extraProtection}
        max={maxProtection}
        format={(value) => `Lv. ${value}`}
        onChange={(value) => {
          if (isValidExtraProtectionLevel(value, slotKey)) {
            onChange({ extraProtection: value });
          }
        }}
      />
    </div>
  );
}
