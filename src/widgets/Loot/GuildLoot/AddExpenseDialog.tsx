"use client";

import { useEffect, useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
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
import { Command, CommandInput, CommandItem, CommandList } from "@/shared/ui";
import { Popover, PopoverTrigger, PopoverContent } from "@/shared/ui";
import { cn } from "@/shared/lib/tw-merge";

type User = { id: number; username: string };

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
  users = [],
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (expense: ExpenseItem) => Promise<void>;
  editMode?: boolean;
  initialValues?: ExpenseItem;
  users?: User[];
}) {
  const [form, setForm] = useState(emptyForm);
  const [sourceSearch, setSourceSearch] = useState("");
  const [isSourceOpen, setIsSourceOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    setSourceSearch("");
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
    setSourceSearch("");
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        aria-describedby={undefined}
        className="sm:max-w-[425px]"
      >
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
          <Popover open={isSourceOpen} onOpenChange={setIsSourceOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className={cn(
                  "cursor-pointer w-full justify-between border rounded px-3 py-2 text-sm flex items-center",
                  !form.source && "text-muted-foreground",
                )}
              >
                {form.source || "Выберите или введите игрока"}
                <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-[350px] p-0">
              <Command>
                <CommandInput
                  placeholder="Поиск..."
                  value={sourceSearch}
                  onValueChange={(val) => {
                    setSourceSearch(val);
                    setForm((f) => ({ ...f, source: val }));
                  }}
                />
                <CommandList>
                  {users.map((user) => (
                    <CommandItem
                      className="cursor-pointer"
                      key={user.id}
                      value={user.username}
                      onSelect={() => {
                        setForm((f) => ({ ...f, source: user.username }));
                        setSourceSearch(user.username);
                        setIsSourceOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          form.source === user.username
                            ? "opacity-100"
                            : "opacity-0",
                        )}
                      />
                      {user.username}
                    </CommandItem>
                  ))}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>

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
