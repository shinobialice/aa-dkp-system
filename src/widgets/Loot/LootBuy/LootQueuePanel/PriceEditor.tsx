import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import type { BuyItem } from "../lootBuyModel";

type Props = {
  item: BuyItem;
  onSave: (price: number | null) => Promise<void>;
  onCancel: () => void;
};

export default function PriceEditor({ item, onSave, onCancel }: Props) {
  const [value, setValue] = useState(
    item.price === null ? "" : String(item.price),
  );
  const [saving, setSaving] = useState(false);

  const save = async () => {
    const parsed = value.trim() === "" ? null : Number(value.replace(",", "."));
    if (parsed !== null && Number.isNaN(parsed)) return;
    setSaving(true);
    try {
      await onSave(parsed);
    } finally {
      setSaving(false);
    }
  };

  return (
    <span className="flex gap-1">
      <input
        type="number"
        step="any"
        min={0}
        autoFocus
        aria-label="Цена"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") save();
          if (event.key === "Escape") onCancel();
        }}
        className="h-7 w-full min-w-0 rounded-md border bg-background px-1.5 text-sm font-semibold tabular-nums outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
      />
      <button
        type="button"
        aria-label="Сохранить цену"
        onClick={save}
        disabled={saving}
        className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-60"
      >
        {saving ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : (
          <Check className="size-3.5" />
        )}
      </button>
    </span>
  );
}
