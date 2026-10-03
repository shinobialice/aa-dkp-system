import { useState } from "react";
import { Trash2 } from "lucide-react";
import type { UserEquipment } from "@/actions/getUserEquipment";
import { Button, Input } from "@/shared/ui";
import { cn } from "@/shared/lib/tw-merge";
import type { EquipmentSlot } from "../../equipmentData";
import { ITEMS_BY_SLOT } from "../../itemsData";
import { GearItemPicker } from "../../GearItemPicker";
import ItemCard from "../ItemCard";
import { CUBE_ELIGIBLE_SLOTS } from "../slotLayout";
import { EMPTY_SLOT_VALUES, type SlotValues } from "../slotValues";
import {
  draftFromItem,
  draftToPreviewItem,
  draftToValues,
  type SlotDraft,
} from "./slotDraft";
import { deriveSlotOptions } from "./slotOptions";
import FieldLabel from "./FieldLabel";
import QualityField from "./QualityField";
import EnchantFields from "./EnchantFields";
import EngravingField from "./EngravingField";
import RuneField from "./RuneField";
import SynthesisFields from "./SynthesisFields";
import EphenSynthesisField from "./EphenSynthesisField";

type Props = {
  slot: EquipmentSlot;
  item: UserEquipment | undefined;
  equipment: UserEquipment[];
  onSave: (values: SlotValues) => Promise<void>;
  onCancel: () => void;
};

export default function SlotEditor({
  slot,
  item,
  equipment,
  onSave,
  onCancel,
}: Props) {
  const [draft, setDraft] = useState(() => draftFromItem(slot.key, item));
  const [saving, setSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const options = deriveSlotOptions(slot.key, draft);
  const hasItemName = draft.itemName.trim() !== "";
  const knownItems = ITEMS_BY_SLOT[slot.key];
  const onChange = (patch: Partial<SlotDraft>) =>
    setDraft((current) => ({ ...current, ...patch }));
  const fieldProps = { slotKey: slot.key, draft, options, onChange };

  const save = async (values: SlotValues) => {
    setSaving(true);
    try {
      await onSave(values);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto md:grid md:grid-cols-[minmax(0,1fr)_320px] md:overflow-hidden">
        {options.gearItem && (
          <div className="border-b px-5 py-3 md:order-2 md:min-h-0 md:overflow-y-auto md:border-b-0 md:border-l md:py-4">
            <button
              type="button"
              aria-expanded={previewOpen}
              onClick={() => setPreviewOpen((open) => !open)}
              className="flex w-full cursor-pointer items-center justify-between text-xs font-semibold text-muted-foreground md:pointer-events-none md:mb-2 md:cursor-default"
            >
              Как будет выглядеть
              <span className="text-xs font-normal md:hidden">
                {previewOpen ? "Скрыть" : "Показать"}
              </span>
            </button>
            <div
              className={cn(
                "mt-2 rounded-xl border bg-card/40 p-3 md:mt-0 md:block",
                !previewOpen && "hidden",
              )}
            >
              <ItemCard
                slotKey={slot.key}
                item={draftToPreviewItem(slot.key, item, draft, options)}
                gearItem={options.gearItem}
                equipment={equipment}
              />
            </div>
          </div>
        )}
        <div className="space-y-4 px-5 py-4 md:order-1 md:min-h-0 md:overflow-y-auto">
          <div className="space-y-1.5">
            <FieldLabel>Предмет</FieldLabel>
            {knownItems && (
              <GearItemPicker
                items={knownItems}
                value={draft.itemName}
                onSelect={(gearItem) =>
                  onChange({ itemName: gearItem.name, grade: gearItem.grade })
                }
              />
            )}
            {!knownItems && (
              <Input
                value={draft.itemName}
                onChange={(event) => onChange({ itemName: event.target.value })}
                placeholder="Название предмета"
              />
            )}
          </div>
          {hasItemName && <QualityField {...fieldProps} />}
          {hasItemName && CUBE_ELIGIBLE_SLOTS.has(slot.key) && (
            <EnchantFields {...fieldProps} />
          )}
          {hasItemName && options.maxEngravingSlots > 0 && (
            <EngravingField {...fieldProps} />
          )}
          {hasItemName && <RuneField {...fieldProps} equipment={equipment} />}
          <SynthesisFields {...fieldProps} />
          <EphenSynthesisField {...fieldProps} />
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2 border-t px-5 py-3">
        {item?.item_name && (
          <Button
            variant="ghost"
            aria-label="Снять предмет"
            className="h-11 cursor-pointer text-destructive hover:bg-destructive/10 hover:text-destructive sm:h-9"
            onClick={() => save(EMPTY_SLOT_VALUES)}
            disabled={saving}
          >
            <Trash2 />
            <span className="hidden sm:inline">Снять предмет</span>
          </Button>
        )}
        <Button
          variant="outline"
          className="ml-auto hidden cursor-pointer sm:inline-flex"
          onClick={onCancel}
          disabled={saving}
        >
          Отмена
        </Button>
        <Button
          className="h-11 flex-1 cursor-pointer sm:h-9 sm:flex-none"
          onClick={() => save(draftToValues(slot.key, draft, options))}
          disabled={saving}
        >
          {saving ? "Сохранение..." : "Сохранить"}
        </Button>
      </div>
    </>
  );
}
