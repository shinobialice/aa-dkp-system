"use client";

import { useEffect, useState } from "react";
import { ExpenseItem } from "./ExpensesTypes";
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

const emptyForm = {
  date: new Date().toISOString().split("T")[0],
  amount: "",
  target: "",
  source: "",
  comment: "",
};

export function AddExpenseDialog({
  open,
  onClose,
  onAdd,
  editMode,
  initialValues,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (expense: ExpenseItem) => Promise<void>;
  editMode?: boolean;
  initialValues?: ExpenseItem;
}) {
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    if (!open) return;
    if (editMode && initialValues) {
      const date =
        typeof initialValues.date === "string"
          ? initialValues.date
          : initialValues.date.toISOString();
      setForm({
        date: date.split("T")[0],
        amount: initialValues.amount.toString(),
        target: initialValues.target,
        source: initialValues.source,
        comment: initialValues.comment ?? "",
      });
    } else {
      setForm(emptyForm);
    }
  }, [open, editMode, initialValues]);

  const handleSubmit = async () => {
    if (!form.amount || !form.target || !form.source) {
      alert("Заполните обязательные поля");
      return;
    }
    await onAdd({
      ...form,
      id: editMode ? initialValues?.id : undefined,
      amount: Number(form.amount),
    });
    onClose();
    setForm(emptyForm);
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {editMode ? "Изменить расход" : "Добавить расход"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-2 py-4">
          <Label>Дата</Label>
          <DateTimePicker
            hideTime
            value={new Date(form.date)}
            onChange={(date) =>
              setForm({
                ...form,
                date: date ? date.toISOString().split("T")[0] : "",
              })
            }
          />

          <Label>Сумма</Label>
          <input
            type="number"
            min={0}
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="border rounded px-2 py-1"
          />

          <Label>Цель</Label>
          <input
            type="text"
            value={form.target}
            onChange={(e) => setForm({ ...form, target: e.target.value })}
            className="border rounded px-2 py-1"
          />

          <Label>Источник</Label>
          <input
            type="text"
            value={form.source}
            onChange={(e) => setForm({ ...form, source: e.target.value })}
            className="border rounded px-2 py-1"
          />

          <Label>Комментарий</Label>
          <textarea
            value={form.comment ?? ""}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
            className="border rounded px-2 py-1"
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
