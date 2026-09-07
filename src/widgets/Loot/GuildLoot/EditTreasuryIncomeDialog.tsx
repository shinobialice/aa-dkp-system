"use client";

import { useEffect, useState } from "react";
import { SourceSelector } from "./SourceSelector";
import { LootItem } from "./LootTypes";
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

// Правка ручной строки дохода "В казну" (см. AddLootDialog — quick-add в
// казну). У такой строки нет покупателя, поэтому вместо SellLootDialog/
// updateLootSale — свой узкий диалог: источник, дата и сумма поступления.
export function EditTreasuryIncomeDialog({
  open,
  onClose,
  item,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  item: LootItem | null;
  onSave: (data: {
    source: string;
    acquired_at: string;
    price: number;
  }) => Promise<void>;
}) {
  const [source, setSource] = useState("");
  const [acquiredAt, setAcquiredAt] = useState("");
  const [amount, setAmount] = useState(0);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (item) {
      setSource(item.source ?? "");
      setAcquiredAt(
        item.acquired_at
          ? new Date(item.acquired_at).toISOString().split("T")[0]
          : "",
      );
      setAmount(item.price ?? item.quantity ?? 0);
    }
  }, [item]);

  const handleSubmit = async () => {
    if (!acquiredAt) {
      return alert("Укажите дату получения!");
    }
    setSaving(true);
    try {
      await onSave({ source, acquired_at: acquiredAt, price: amount });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent aria-describedby={undefined} className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Изменить поступление в казну</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2 py-4">
          <Label>Источник</Label>
          <SourceSelector value={source} onChange={setSource} />

          <Label>Дата получения</Label>
          <DateTimePicker
            hideTime
            value={acquiredAt ? new Date(acquiredAt) : undefined}
            onChange={(date) =>
              setAcquiredAt(date ? date.toISOString().split("T")[0] : "")
            }
          />

          <Label>Сумма дохода</Label>
          <input
            type="number"
            min={1}
            value={amount}
            onChange={(e) => setAmount(parseInt(e.target.value) || 0)}
            className="border rounded px-2 py-1"
            placeholder="Введите сумму дохода"
          />
        </div>
        <DialogFooter>
          <Button
            className="cursor-pointer"
            variant="secondary"
            onClick={onClose}
            disabled={saving}
          >
            Отмена
          </Button>
          <Button className="cursor-pointer" onClick={handleSubmit} disabled={saving}>
            Сохранить
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
