import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui";
import {
  formatSynthesisValue,
  MAX_SYNTHESIS_PERCENT,
  NO_SYNTHESIS_EFFECT,
} from "../../itemsData/synthesis";
import FieldLabel from "./FieldLabel";
import type { FieldProps } from "./fieldProps";

const NOT_CHOSEN = String(NO_SYNTHESIS_EFFECT);

export default function SynthesisField({
  draft,
  options,
  onChange,
}: FieldProps) {
  if (options.synthesisSlots.length === 0) return null;

  const handleEffectChange = (slot: number, code: number) => {
    const synthesisEffects = options.synthesisSlots.map(
      (_, index) => draft.synthesisEffects[index] ?? NO_SYNTHESIS_EFFECT,
    );
    synthesisEffects[slot] = code;
    onChange({ synthesisEffects });
  };

  return (
    <div className="space-y-1.5">
      <FieldLabel>Эффекты синтеза</FieldLabel>
      {options.hasSynthesisGrowth && (
        <PercentSlider
          value={draft.synthesisPercent}
          onChange={(synthesisPercent) => onChange({ synthesisPercent })}
        />
      )}
      {options.synthesisSlots.map((slotOptions, slot) => (
        <Select
          key={slot}
          value={String(draft.synthesisEffects[slot] ?? NO_SYNTHESIS_EFFECT)}
          onValueChange={(value) => handleEffectChange(slot, Number(value))}
        >
          <SelectTrigger className="w-full cursor-pointer">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NOT_CHOSEN}>
              Эффект {slot + 1}: не выбран
            </SelectItem>
            {slotOptions.map((roll) => (
              <SelectItem key={roll.code} value={String(roll.code)}>
                {roll.effect.label}: {formatSynthesisValue(roll)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ))}
    </div>
  );
}

function PercentSlider({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Опыт синтеза</span>
        <span>{value}%</span>
      </div>
      <input
        type="range"
        min={0}
        max={MAX_SYNTHESIS_PERCENT}
        step={1}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="w-full cursor-pointer"
      />
    </div>
  );
}
