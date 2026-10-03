"use client";

import { useRetainedValue } from "@/hooks/useRetainedValue";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui";
import type { ExpenseItem } from "../ExpensesTypes";
import type { PlayerOption } from "../PlayerCombobox";
import ExpenseForm from "./ExpenseForm";

export type ExpenseDialogRequest = { expense?: ExpenseItem };

type Props = {
  request: ExpenseDialogRequest | null;
  users: PlayerOption[];
  onClose: () => void;
  onSave: (expense: ExpenseItem) => Promise<void>;
};

export default function ExpenseDialog({
  request,
  users,
  onClose,
  onSave,
}: Props) {
  const shown = useRetainedValue(request);
  const isEdit = !!shown?.expense;

  return (
    <Dialog open={!!request} onOpenChange={(open) => !open && onClose()}>
      <DialogContent aria-describedby={undefined} className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Изменить расход" : "Добавить расход"}
          </DialogTitle>
        </DialogHeader>
        {shown && (
          <ExpenseForm
            key={shown.expense?.id ?? "new"}
            expense={shown.expense}
            users={users}
            onCancel={onClose}
            onSave={async (expense) => {
              await onSave(expense);
              onClose();
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
