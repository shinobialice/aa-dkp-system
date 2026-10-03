import { SynthesisEffectPicker } from "../../SynthesisEffectPicker";
import {
  RING_SYNTHESIS_EFFECTS,
  RING_SYNTHESIS_SLOT_COUNT,
} from "../../itemsData/ringSynthesis";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui";
import FieldLabel from "./FieldLabel";
import type { FieldProps } from "./fieldProps";

const TITLE = "Эффекты синтеза";
const NOT_CHOSEN = "-1";

export default function SynthesisFields({
  draft,
  options,
  onChange,
}: FieldProps) {
  return (
    <>
      {options.hasSynthesisRole && (
        <div className="space-y-1.5">
          <FieldLabel>{TITLE}</FieldLabel>
          {options.maxSynthesisSlots > 0 && (
            <SynthesisEffectPicker
              effects={options.synthesisEffectOptions}
              slotCount={options.maxSynthesisSlots}
              value={draft.synthesisEffects}
              onChange={(synthesisEffects) => onChange({ synthesisEffects })}
            />
          )}
          {options.maxSynthesisSlots === 0 && (
            <div className="text-xs text-muted-foreground">
              Доступны начиная с качества «Необычный» — выберите качество выше.
            </div>
          )}
        </div>
      )}

      {options.cursedSynthesisPools.length > 0 && (
        <div className="space-y-1.5">
          <FieldLabel>{TITLE}</FieldLabel>
          <div className="space-y-1.5">
            {options.cursedSynthesisPools.map((pool, index) => (
              <Select
                key={index}
                value={String(
                  draft.cursedSynthesisEffects[index] ?? NOT_CHOSEN,
                )}
                onValueChange={(value) => {
                  const next = [...draft.cursedSynthesisEffects];
                  next[index] = Number(value);
                  onChange({ cursedSynthesisEffects: next });
                }}
              >
                <SelectTrigger className="w-full cursor-pointer">
                  <SelectValue placeholder="Выберите" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NOT_CHOSEN}>Выберите</SelectItem>
                  {pool.map((effect) => (
                    <SelectItem key={effect.id} value={String(effect.id)}>
                      {effect.label}:{" "}
                      {effect.isPercent
                        ? `${effect.value}%`
                        : `${effect.value} ед.`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ))}
          </div>
        </div>
      )}

      {options.isRingSynthesis && (
        <div className="space-y-1.5">
          <FieldLabel>{TITLE}</FieldLabel>
          <SynthesisEffectPicker
            effects={RING_SYNTHESIS_EFFECTS}
            slotCount={RING_SYNTHESIS_SLOT_COUNT}
            value={draft.ringSynthesisEffects}
            onChange={(ringSynthesisEffects) =>
              onChange({ ringSynthesisEffects })
            }
          />
        </div>
      )}
    </>
  );
}
