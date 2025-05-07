"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LootIcon } from "../LootBuy/icons/LootIconComponent";
import { LootItem } from "./LootTypes";
import { updateLootItem } from "@/src/actions/updateLootItem";
import { deleteLootItem } from "@/src/actions/deleteLootItem";

type Props = {
  open: boolean;
  onClose: () => void;
  itemName: string;
  items: LootItem[];
  onReload: () => Promise<void>;
};

export function EditGroupedLootDialog({
  open,
  onClose,
  itemName,
  items,
  onReload,
}: Props) {
  const [editedItems, setEditedItems] = useState<LootItem[]>([]);

  useEffect(() => {
    if (open) {
      setEditedItems(items);
    }
  }, [open, items]);

  const handleFieldChange = (
    index: number,
    field: keyof LootItem,
    value: string
  ) => {
    const updated = [...editedItems];

    if (field === "quantity") {
      updated[index] = {
        ...updated[index],
        [field]: parseInt(value),
      };
    } else if (field === "acquired_at") {
      updated[index] = {
        ...updated[index],
        [field]: new Date(value),
      };
    } else {
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
    }

    setEditedItems(updated);
  };

  const handleSave = async (item: LootItem) => {
    if (!item.quantity || item.quantity < 1) {
      alert("Количество должно быть положительным");
      return;
    }
    await updateLootItem({
      id: item.id,
      quantity: item.quantity,
      source: item.source || "",
      acquired_at: item.acquired_at || new Date(),
    });
    await onReload();
  };

  const handleDelete = async (item: LootItem) => {
    if (confirm("Удалить эту запись?")) {
      await deleteLootItem(item.id);
      await onReload();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Редактировать {itemName}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto px-1">
          {editedItems.map((item, idx) => (
            <div
              key={item.id}
              className="flex flex-col md:flex-row md:items-end gap-2 border p-3 rounded-md"
            >
              <div className="flex items-center gap-2 md:w-1/4">
                <LootIcon itemName={itemName} size={28} />
                <span className="font-medium">{itemName}</span>
              </div>

              <div className="flex flex-col w-full md:w-1/5">
                <Label>Количество</Label>
                <Input
                  type="number"
                  min={1}
                  value={item.quantity ?? 1}
                  onChange={(e) =>
                    handleFieldChange(idx, "quantity", e.target.value)
                  }
                />
              </div>

              <div className="flex flex-col w-full md:w-1/3">
                <Label>Источник</Label>
                <Input
                  value={item.source ?? ""}
                  onChange={(e) =>
                    handleFieldChange(idx, "source", e.target.value)
                  }
                />
              </div>

              <div className="flex flex-col w-full md:w-1/4">
                <Label>Дата получения</Label>
                <Input
                  type="date"
                  value={
                    item.acquired_at
                      ? new Date(item.acquired_at).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={(e) =>
                    handleFieldChange(idx, "acquired_at", e.target.value)
                  }
                />
              </div>

              <div className="flex gap-2 mt-2 md:mt-0">
                <Button
                  className="cursor-pointer"
                  size="sm"
                  onClick={() => handleSave(item)}
                >
                  Сохранить
                </Button>
                <Button
                  className="cursor-pointer"
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(item)}
                >
                  Удалить
                </Button>
              </div>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button variant="secondary" onClick={onClose}>
            Закрыть
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
