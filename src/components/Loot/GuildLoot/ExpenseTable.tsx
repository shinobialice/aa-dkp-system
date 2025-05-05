"use client";

import { useState, useEffect } from "react";
import { LootTableControls } from "./LootTableControls";
import { ExpenseItem } from "./ExpensesTypes";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";

export function ExpensesTable() {
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);

  useEffect(() => {
    // Временный мок, позже заменить на fetch из API
    setExpenses([
      {
        date: "2025-05-04",
        amount: 200,
        target: "Ремонт шмота",
        source: "Казна",
        comment: "После осады",
      },
      {
        date: "2025-04-20",
        amount: 150,
        target: "Баффы",
        source: "Пожертвования",
        comment: "Перед инстой",
      },
    ]);
  }, []);

  const filteredExpenses = expenses.filter((e) => {
    const d = new Date(e.date);
    return d.getMonth() + 1 === month && d.getFullYear() === year;
  });

  return (
    <div className="col-span-2 space-y-4">
      <LootTableControls
        month={month}
        year={year}
        onMonthChange={setMonth}
        onYearChange={setYear}
        onAddClick={() => alert("Добавить расход — не реализовано")}
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.length > 0 ? (
                filteredExpenses.map((exp, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      {new Intl.DateTimeFormat("ru-RU").format(
                        new Date(exp.date)
                      )}
                    </TableCell>
                    <TableCell>{exp.amount}</TableCell>
                    <TableCell>{exp.target}</TableCell>
                    <TableCell>{exp.source}</TableCell>
                    <TableCell>{exp.comment}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={5}
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
