import {
  getMaxExtraProtectionLevel,
  isValidEnchantLevel,
  isValidExtraProtectionLevel,
} from "../../itemsData/statsFormula";
import Stepper from "./Stepper";
import type { FieldProps } from "./fieldProps";

export default function EnchantFields({
  slotKey,
  draft,
  options,
  onChange,
}: FieldProps) {
  const maxProtection = getMaxExtraProtectionLevel(slotKey);
  const { maxEnchant } = options;

  return (
    <div className="grid grid-cols-2 gap-3">
      {maxEnchant > 0 && (
        <Stepper
          label="Куб"
          hint={`макс. ${maxEnchant}`}
          value={draft.enchant}
          max={maxEnchant}
          prefix="+"
          onChange={(value) => {
            if (isValidEnchantLevel(value, maxEnchant)) {
              onChange({ enchant: value });
            }
          }}
          showMax
        />
      )}
      <Stepper
        label="Защита от доп. урона"
        hint={`ур. 0–${maxProtection}`}
        value={draft.extraProtection}
        max={maxProtection}
        prefix="Lv. "
        onChange={(value) => {
          if (isValidExtraProtectionLevel(value, slotKey)) {
            onChange({ extraProtection: value });
          }
        }}
      />
    </div>
  );
}
