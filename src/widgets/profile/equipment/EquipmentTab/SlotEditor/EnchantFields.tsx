import { isValidEnchantLevel } from "../../itemsData/statsFormula";
import Stepper from "./Stepper";
import type { FieldProps } from "./fieldProps";

export default function EnchantFields({
  draft,
  options,
  onChange,
}: FieldProps) {
  const { maxEnchant } = options;
  if (maxEnchant === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-3">
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
    </div>
  );
}
