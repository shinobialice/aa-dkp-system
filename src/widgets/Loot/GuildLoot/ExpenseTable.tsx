"use client";

import { useState, useEffect } from "react";
import { AddExpenseDialog } from "./AddExpenseDialog";
import { ExpenseItem } from "./ExpensesTypes";
import { LootTableControls } from "./LootTableControls";
import { Button, ScrollArea } from "@/shared/ui";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/shared/ui";
import {
  getExpenses,
  addExpense,
  updateExpense,
  deleteExpense,
} from "@/actions/expenseActions";

type Props = { isAdmin: boolean };

export default function ExpensesTable({ isAdmin }: Props) {
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const [editingExpense, setEditingExpense] = useState<ExpenseItem | null>(
    null,
  );

  useEffect(() => {
    const load = async () => {
      const all = await getExpenses();
      setExpenses(all);
    };
    load();
    const interval = setInterval(load, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleAdd = async (exp: ExpenseItem) => {
    const date =
      typeof exp.date === "string"
        ? exp.date
        : exp.date.toISOString().split("T")[0];

    if (exp.id) {
      await updateExpense({
        ...exp,
        id: exp.id,
        date,
        comment: exp.comment ?? undefined,
      });
    } else {
      await addExpense({
        ...exp,
        date,
        comment: exp.comment ?? undefined,
      });
    }
    setExpenses(await getExpenses());
    setShowDialog(false);
    setEditingExpense(null);
  };

  const handleDelete = async (exp: ExpenseItem) => {
    if (!exp.id) return;
    if (!confirm("Удалить этот расход?")) return;
    const date =
      typeof exp.date === "string"
        ? exp.date
        : exp.date.toISOString().split("T")[0];
    await deleteExpense(exp.id, date);
    setExpenses(await getExpenses());
  };

  const filteredExpenses = expenses.filter((e) => {
    const d = new Date(e.date);
    return d.getMonth() + 1 === month && d.getFullYear() === year;
  });

  return (
    <div className="col-span-2 space-y-4">
      <LootTableControls
        isAdmin={isAdmin}
        month={month}
        year={year}
        onMonthChange={setMonth}
        onYearChange={setYear}
        onAddClick={() => setShowDialog(true)}
        label="Добавить расход"
      />

      <AddExpenseDialog
        open={showDialog}
        onClose={() => {
          setShowDialog(false);
          setEditingExpense(null);
        }}
        onAdd={handleAdd}
        editMode={!!editingExpense}
        initialValues={editingExpense ?? undefined}
      />

      <div className="overflow-auto rounded-md border">
        <ScrollArea className="h-[1000px] w-full">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-background">
              <TableRow>
                <TableHead>Дата</TableHead>
                <TableHead>Сумма</TableHead>
                <TableHead>Цель</TableHead>
                <TableHead>Источник</TableHead>
                <TableHead>Комментарий</TableHead>
                {isAdmin && <TableHead>Действия</TableHead>}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((exp, i) => (
                  <TableRow key={exp.id ?? i}>
                    <TableCell>
                      {new Intl.DateTimeFormat("ru-RU").format(
                        new Date(exp.date),
                      )}
                    </TableCell>
                    <TableCell>{exp.amount}</TableCell>
                    <TableCell>{exp.target}</TableCell>
                    <TableCell>{exp.source}</TableCell>
                    <TableCell>{exp.comment}</TableCell>
                    {isAdmin && (
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            className="cursor-pointer"
                            onClick={() => {
                              setEditingExpense(exp);
                              setShowDialog(true);
                            }}
                          >
                            Изменить
                          </Button>
                          <Button
                            className="cursor-pointer"
                            variant="destructive"
                            onClick={() => handleDelete(exp)}
                          >
                            Удалить
                          </Button>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={isAdmin ? 6 : 5}
                    className="text-center text-muted-foreground p-4"
                  >
                    Нет расходов за выбранный период
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>
    </div>
  );
}
