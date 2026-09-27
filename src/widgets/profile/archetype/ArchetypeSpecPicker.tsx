"use client";
import type { ArchetypeSlot } from "@/actions/getUserArchetype";
import { SpecializationIcon } from "./SpecializationIcon";
import { SPECIALIZATIONS } from "./specializationsData";
import { lookupClassName } from "./classCombinations";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/shared/ui";

export type SpecKey = "specialization1" | "specialization2" | "specialization3";

export const SPEC_KEYS: SpecKey[] = [
  "specialization1",
  "specialization2",
  "specialization3",
];

const NONE = "Нет";

export function isArchetypeComplete(slot: ArchetypeSlot): boolean {
  return SPEC_KEYS.every((key) => !!slot[key]);
}

export default function ArchetypeSpecPicker({
  value,
  onChange,
  disabled = false,
  invalid = false,
  showLabels = true,
}: {
  value: ArchetypeSlot;
  onChange: (key: SpecKey, specId: string | null) => void;
  disabled?: boolean;
  invalid?: boolean;
  showLabels?: boolean;
}) {
  const comboMatch = lookupClassName([
    value.specialization1,
    value.specialization2,
    value.specialization3,
  ]);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {SPEC_KEYS.map((key, i) => {
          const otherChosen = SPEC_KEYS.filter((k) => k !== key)
            .map((k) => value[k])
            .filter(Boolean);
          return (
            <div key={key} className="space-y-1.5">
              {showLabels && (
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                  Специализация {i + 1}
                </div>
              )}
              <Select
                value={value[key] ?? NONE}
                onValueChange={(v) => onChange(key, v === NONE ? null : v)}
                disabled={disabled}
              >
                <SelectTrigger
                  className="w-full cursor-pointer"
                  aria-invalid={invalid && !value[key]}
                >
                  <SelectValue placeholder="Не выбрано" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE}>Нет</SelectItem>
                  {SPECIALIZATIONS.filter(
                    (spec) => !otherChosen.includes(spec.id),
                  ).map((spec) => (
                    <SelectItem key={spec.id} value={spec.id}>
                      <span className="flex items-center gap-2">
                        <SpecializationIcon id={spec.id} size={16} />
                        {spec.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        })}
      </div>
      <p className="text-sm">
        {comboMatch ? (
          <span className="font-semibold">{comboMatch}</span>
        ) : (
          <span className="text-muted-foreground">
            Выбери 3 специализации — название класса подставится само
          </span>
        )}
      </p>
    </div>
  );
}
