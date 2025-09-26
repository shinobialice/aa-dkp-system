"use client";

import { useState } from "react";
import { LootItemSelector } from "./LootItemSelector";
import { ItemType, NewLootItem } from "./LootTypes";
import { LootIcon } from "../LootBuy/icons/LootIconComponent";
import { Button } from "@/shared/ui";
import { DateTimePicker } from "@/shared/ui";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/ui";
import { Label } from "@/shared/ui";

export function AddLootDialog({
  open,
  onClose,
  onAdd,
  itemTypes,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (item: NewLootItem) => Promise<void>;
  itemTypes: ItemType[];
}) {
  const [form, setForm] = useState<NewLootItem>({
    itemTypeId: 0,
    source: "",
    acquired_at: new Date().toISOString().split("T")[0],
    quantity: 1,
    itemName: "",
  });

  const getItemTypeIdByName = (name: string): number | undefined =>
    itemTypes.find((item) => item.name === name)?.id;

  const isOtherType = form.itemName === "Другое";

  const handleSelect = (name: string) => {
    const id = getItemTypeIdByName(name);
    if (!id) {
      return;
    }
    setForm((prev) => ({ ...prev, itemTypeId: id, itemName: name }));
  };

  const handleSubmit = async () => {
    if (!form.itemTypeId) {
      return alert("Выберите предмет из списка!");
    }
    let itemToAdd = { ...form };
    if (isOtherType) {
      itemToAdd = {
        ...itemToAdd,
        status: "Продано",
        sold_at: new Date().toISOString(),
      };
    }
    await onAdd(itemToAdd);
    onClose();
    setForm({
      itemTypeId: 0,
      source: "",
      acquired_at: new Date().toISOString().split("T")[0],
      quantity: 1,
      itemName: "",
    });
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent aria-describedby={undefined} className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Добавить доход</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2 py-4">
          <Label>Предмет</Label>
          {form.itemName && (
            <div className="flex items-center gap-2 mb-2">
              <LootIcon itemName={form.itemName} size={32} />
              <span className="font-medium">{form.itemName}</span>
            </div>
          )}
          <LootItemSelector
            value={form.itemName || ""}
            onSelect={handleSelect}
          />

          <Label>Источник</Label>
          <input
            type="text"
            value={form.source}
            onChange={(e) => setForm({ ...form, source: e.target.value })}
            className="border rounded px-2 py-1"
          />

          <Label>Дата получения</Label>
          <DateTimePicker
            hideTime
            value={form.acquired_at ? new Date(form.acquired_at) : undefined}
            onChange={(date) =>
              setForm({
                ...form,
                acquired_at: date ? date.toISOString().split("T")[0] : "",
              })
            }
          />

          <Label>{isOtherType ? "Сумма дохода" : "Количество"}</Label>
          <input
            type="number"
            min={1}
            value={form.quantity}
            onChange={(e) =>
              setForm({ ...form, quantity: parseInt(e.target.value) })
            }
            className="border rounded px-2 py-1"
            placeholder={isOtherType ? "Введите сумму дохода" : "Количество"}
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
