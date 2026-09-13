"use client";

export type SynthesisEffectOption = {
  id: number;
  label: string;
  value: number;
  isPercent: boolean;
};

function formatEffectValue(value: number, isPercent: boolean): string {
  return isPercent ? `${value}%` : `${value} ед.`;
}

export function SynthesisEffectPicker({
  effects,
  slotCount,
  value,
  onChange,
}: {
  effects: SynthesisEffectOption[];
  slotCount: number;
  value: number[];
  onChange: (ids: number[]) => void;
}) {
  const toggle = (id: number) => {
    if (value.includes(id)) {
      onChange(value.filter((v) => v !== id));
      return;
    }
    if (value.length >= slotCount) return;
    onChange([...value, id]);
  };

  return (
    <div className="space-y-1.5">
      <div className="text-xs text-muted-foreground">
        Выбрано: {value.length}/{slotCount}
      </div>
      <div className="max-h-48 space-y-0.5 overflow-y-auto rounded-md border p-1">
        {effects.map((effect) => {
          const checked = value.includes(effect.id);
          const disabled = !checked && value.length >= slotCount;
          return (
            <label
              key={effect.id}
              className={`flex cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-sm hover:bg-accent ${
                disabled ? "cursor-not-allowed opacity-40 hover:bg-transparent" : ""
              }`}
            >
              <input
                type="checkbox"
                checked={checked}
                disabled={disabled}
                onChange={() => toggle(effect.id)}
                className="cursor-pointer"
              />
              <span className="min-w-0 flex-1 truncate">
                {effect.label}: {formatEffectValue(effect.value, effect.isPercent)}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
