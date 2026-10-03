"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
} from "@/shared/ui";
import type { StockGroup } from "./stockModel";

type Props = {
  group: StockGroup | null;
  onClose: () => void;
  onSave: (group: StockGroup, price: number | null) => Promise<void>;
};

export default function EditPriceDialog({ group, onClose, onSave }: Props) {
  const [value, setValue] = useState("");
  const [saving, setSaving] = useState(false);
  const [lastGroup, setLastGroup] = useState(group);

  if (group && group !== lastGroup) {
    setLastGroup(group);
    setValue(group.unitPrice?.toString() ?? "");
  }

  const shown = group ?? lastGroup;

  const handleSave = async () => {
    if (!group) return;
    const price = value.trim() === "" ? null : Number(value);
    if (price !== null && (Number.isNaN(price) || price < 0)) {
      toast.error("Цена должна быть числом не меньше нуля");
      return;
    }
    setSaving(true);
    try {
      await onSave(group, price);
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Не удалось сохранить цену");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog
      open={!!group}
      onOpenChange={(open) => !open && !saving && onClose()}
    >
      <DialogContent className="sm:max-w-100">
        <DialogHeader>
          <DialogTitle>Цена за штуку</DialogTitle>
          <DialogDescription>
            {shown?.name}. Цена поменяется и в «Покупке лута».
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="stock-unit-price">Цена</Label>
          <Input
            id="stock-unit-price"
            type="number"
            min={0}
            inputMode="numeric"
            value={value}
            placeholder={shown?.isBundled ? "Идут в комплекте" : "Не задана"}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") handleSave();
            }}
          />
          <p className="text-xs text-muted-foreground">
            Оставьте пустым, если у предмета нет цены
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={saving}>
            Отмена
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
