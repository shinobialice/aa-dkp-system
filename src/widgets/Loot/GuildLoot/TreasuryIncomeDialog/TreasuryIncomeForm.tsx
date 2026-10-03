"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Button,
  DateTimePicker,
  DialogFooter,
  Input,
  Label,
} from "@/shared/ui";
import type { LootItem } from "../LootTypes";
import SourceSelector from "../SourceSelector";

export type TreasuryIncomeValues = {
  source: string;
  acquired_at: string;
  price: number;
};

type Props = {
  item: LootItem;
  onCancel: () => void;
  onSave: (values: TreasuryIncomeValues) => Promise<void>;
};

export default function TreasuryIncomeForm({ item, onCancel, onSave }: Props) {
  const [source, setSource] = useState(item.source ?? "");
  const [acquiredAt, setAcquiredAt] = useState(() =>
    item.acquired_at
      ? new Date(item.acquired_at).toISOString().split("T")[0]
      : "",
  );
  const [amount, setAmount] = useState(item.price ?? item.quantity);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!acquiredAt) {
      toast.error("Укажите дату получения!");
      return;
    }
    setSaving(true);
    try {
      await onSave({ source, acquired_at: acquiredAt, price: amount });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
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

        <Label htmlFor="income-amount">Сумма дохода</Label>
        <Input
          id="income-amount"
          type="number"
          min={1}
          value={amount}
          onChange={(event) => setAmount(parseInt(event.target.value) || 0)}
          placeholder="Введите сумму дохода"
        />
      </div>
      <DialogFooter>
        <Button
          className="cursor-pointer"
          variant="secondary"
          onClick={onCancel}
          disabled={saving}
        >
          Отмена
        </Button>
        <Button
          className="cursor-pointer"
          onClick={handleSubmit}
          disabled={saving}
        >
          Сохранить
        </Button>
      </DialogFooter>
    </>
  );
}
