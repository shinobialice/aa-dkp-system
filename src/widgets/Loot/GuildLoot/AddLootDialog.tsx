"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Button,
  DateTimePicker,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
} from "@/shared/ui";
import { LootIcon } from "../LootBuy/icons/LootIconComponent";
import LootItemSelector from "./LootItemSelector";
import {
  isPrimeLinkableSource,
  type ItemType,
  type NewLootItem,
} from "./LootTypes";
import RaidLinkPicker from "./RaidLinkPicker";
import SourceSelector from "./SourceSelector";

const TREASURY_ITEM = "В казну";

type Props = {
  open: boolean;
  itemTypes: ItemType[];
  presetItemName?: string;
  onClose: () => void;
  onAdd: (item: NewLootItem) => Promise<void>;
};

export default function AddLootDialog({
  open,
  itemTypes,
  presetItemName,
  onClose,
  onAdd,
}: Props) {
  const [form, setForm] = useState(() => emptyForm(itemTypes, presetItemName));
  const selectedItemType = itemTypes.find(
    (item) => item.name === form.itemName,
  );
  const isTreasury = form.itemName === TREASURY_ITEM;

  const update = (patch: Partial<NewLootItem>) =>
    setForm({ ...form, ...patch });

  const handleSelect = (name: string) => {
    const itemType = itemTypes.find((item) => item.name === name);
    if (itemType) update({ itemTypeId: itemType.id, itemName: name });
  };

  const handleSubmit = async () => {
    if (!form.itemTypeId) {
      toast.error("Выберите предмет из списка!");
      return;
    }
    await onAdd(isTreasury ? asTreasuryIncome(form) : form);
    onClose();
    setForm(emptyForm(itemTypes));
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !next && onClose()}>
      <DialogContent aria-describedby={undefined} className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isTreasury ? "Золото в казну" : "Дроп с босса"}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2 py-4">
          <Label>Предмет</Label>
          {form.itemName && (
            <div className="mb-2 flex items-center gap-2">
              <LootIcon
                itemName={form.itemName}
                iconUrl={selectedItemType?.icon_url}
                grade={selectedItemType?.grade}
                size={32}
              />
              <span className="font-medium">{form.itemName}</span>
            </div>
          )}
          <LootItemSelector
            value={form.itemName}
            onSelect={handleSelect}
            itemTypes={itemTypes}
          />

          <Label>Источник</Label>
          <SourceSelector
            value={form.source}
            onChange={(source) => update({ source, raidId: null })}
          />

          <Label>Дата получения</Label>
          <DateTimePicker
            hideTime
            value={form.acquired_at ? new Date(form.acquired_at) : undefined}
            onChange={(date) =>
              update({ acquired_at: date ? dayOf(date) : "", raidId: null })
            }
          />

          {isPrimeLinkableSource(form.source) && (
            <>
              <Label>Рейд</Label>
              <RaidLinkPicker
                source={form.source}
                acquiredAt={form.acquired_at || null}
                value={form.raidId ?? null}
                onChange={(raidId) => update({ raidId })}
              />
            </>
          )}

          <Label htmlFor="loot-quantity">
            {isTreasury ? "Сумма дохода" : "Количество"}
          </Label>
          <Input
            id="loot-quantity"
            type="number"
            min={1}
            value={form.quantity || ""}
            onChange={(event) =>
              update({ quantity: parseInt(event.target.value) || 0 })
            }
            placeholder={isTreasury ? "Введите сумму дохода" : "Количество"}
          />
        </div>
        <DialogFooter>
          <Button
            className="cursor-pointer"
            variant="secondary"
            onClick={onClose}
          >
            Отмена
          </Button>
          <Button className="cursor-pointer" onClick={handleSubmit}>
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function emptyForm(itemTypes: ItemType[], presetName?: string): NewLootItem {
  const preset = itemTypes.find((item) => item.name === presetName);
  return {
    itemTypeId: preset?.id ?? 0,
    source: "",
    acquired_at: dayOf(new Date()),
    quantity: 1,
    itemName: preset?.name ?? "",
    raidId: null,
  };
}

// Для строки "В казну" поле количества — это сумма дохода: в казне она
// считается по price, а quantity фиксируем 1, чтобы в таблице не было
// "35000 шт." вместо реальной суммы.
function asTreasuryIncome(form: NewLootItem): NewLootItem {
  return {
    ...form,
    status: TREASURY_ITEM,
    sold_at: new Date().toISOString(),
    price: form.quantity,
    quantity: 1,
  };
}

function dayOf(date: Date) {
  return date.toISOString().split("T")[0];
}
