"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  Button,
  DateTimePicker,
  DialogFooter,
  Input,
  Label,
  Textarea,
} from "@/shared/ui";
import type { ExpenseItem } from "../ExpensesTypes";
import PlayerCombobox, { type PlayerOption } from "../PlayerCombobox";

type Props = {
  expense?: ExpenseItem;
  users: PlayerOption[];
  onCancel: () => void;
  onSave: (expense: ExpenseItem) => Promise<void>;
};

export default function ExpenseForm({
  expense,
  users,
  onCancel,
  onSave,
}: Props) {
  const [date, setDate] = useState(() =>
    dayOf(expense?.date ?? new Date().toISOString()),
  );
  const [amount, setAmount] = useState(expense ? String(expense.amount) : "");
  const [target, setTarget] = useState(expense?.target ?? "");
  const [source, setSource] = useState(expense?.source ?? "");
  const [comment, setComment] = useState(expense?.comment ?? "");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!amount || !target || !source) {
      toast.error("Заполните обязательные поля");
      return;
    }
    setSaving(true);
    try {
      await onSave({
        id: expense?.id,
        date,
        amount: Number(amount),
        target,
        source,
        comment,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="flex flex-col gap-2 py-4">
        <Label>Дата</Label>
        <DateTimePicker
          hideTime
          value={new Date(date)}
          onChange={(value) => setDate(value ? dayOf(value.toISOString()) : "")}
        />

        <Label htmlFor="expense-amount">Сумма</Label>
        <Input
          id="expense-amount"
          type="number"
          min={0}
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
        />

        <Label htmlFor="expense-target">Цель</Label>
        <Input
          id="expense-target"
          value={target}
          onChange={(event) => setTarget(event.target.value)}
        />

        <Label htmlFor="expense-source">Источник</Label>
        <PlayerCombobox
          id="expense-source"
          users={users}
          value={{ name: source }}
          onChange={(choice) => setSource(choice.name)}
        />

        <Label htmlFor="expense-comment">Комментарий</Label>
        <Textarea
          id="expense-comment"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
        />
      </div>

      <DialogFooter>
        <Button
          className="cursor-pointer"
          variant="secondary"
          onClick={onCancel}
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

function dayOf(isoDate: string) {
  return isoDate.split("T")[0];
}
