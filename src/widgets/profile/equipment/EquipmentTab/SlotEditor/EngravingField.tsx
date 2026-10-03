import { EngravingPicker } from "../../EngravingPicker";
import { EngravingIcon } from "../../EngravingIcon";
import { EngravingTooltip } from "../../EngravingTooltip";
import { findEngraving } from "../../itemsData/engravings";
import FieldLabel from "./FieldLabel";
import type { FieldProps } from "./fieldProps";

export default function EngravingField({
  slotKey,
  draft,
  options,
  onChange,
}: FieldProps) {
  const slotCount = options.maxEngravingSlots;
  const filledCount = draft.engravings
    .slice(0, slotCount)
    .filter(Boolean).length;

  const toggleSlot = (index: number) => {
    const next = [...draft.engravings];
    while (next.length <= index) next.push(0);
    next[index] = next[index] ? 0 : draft.selectedEngravingId;
    onChange({ engravings: next });
  };

  const fillAll = () =>
    onChange({
      engravings: Array.from(
        { length: slotCount },
        () => draft.selectedEngravingId,
      ),
    });

  return (
    <div className="space-y-2">
      <FieldLabel
        hint={
          <span className="flex gap-3">
            <button
              type="button"
              disabled={!draft.selectedEngravingId}
              onClick={fillAll}
              className="cursor-pointer text-xs font-semibold text-green-500 hover:underline disabled:cursor-default disabled:opacity-40 disabled:hover:no-underline"
            >
              Заполнить все
            </button>
            <button
              type="button"
              onClick={() => onChange({ engravings: [] })}
              className="cursor-pointer text-xs font-semibold text-red-400 hover:underline"
            >
              Снять все
            </button>
          </span>
        }
      >
        Гравировки · {filledCount} / {slotCount}
      </FieldLabel>
      <EngravingPicker
        slot={slotKey}
        handedness={options.handedness}
        itemId={options.gearItem?.id}
        value={draft.selectedEngravingId}
        onSelect={(id) => onChange({ selectedEngravingId: id })}
      />
      <div className="flex flex-wrap items-center gap-1.5">
        {Array.from({ length: slotCount }, (_, index) => (
          <EngravingSlot
            key={index}
            engravingId={draft.engravings[index] ?? 0}
            canPlace={!!draft.selectedEngravingId}
            onToggle={() => toggleSlot(index)}
          />
        ))}
      </div>
      <p className="text-xs text-muted-foreground">
        Клик по пустой ячейке ставит выбранную гравировку, по заполненной —
        снимает её
      </p>
    </div>
  );
}

function EngravingSlot({
  engravingId,
  canPlace,
  onToggle,
}: {
  engravingId: number;
  canPlace: boolean;
  onToggle: () => void;
}) {
  const engraving = findEngraving(engravingId);
  const square = (
    <button
      type="button"
      onClick={onToggle}
      disabled={!engraving && !canPlace}
      className={`flex size-9 shrink-0 items-center justify-center rounded-md border transition-colors ${slotTone(!!engraving, canPlace)}`}
    >
      {engraving && <EngravingIcon engraving={engraving} size={28} />}
    </button>
  );

  if (!engraving) return <span>{square}</span>;
  return (
    <EngravingTooltip engraving={engraving} side="top">
      {square}
    </EngravingTooltip>
  );
}

function slotTone(filled: boolean, canPlace: boolean) {
  if (filled) {
    return "cursor-pointer border-border bg-input/30 hover:border-destructive/60";
  }
  if (canPlace) {
    return "cursor-pointer border-dashed border-primary/60 bg-muted hover:bg-accent";
  }
  return "cursor-default border-border bg-muted";
}
