"use client";

import { useEffect, useState } from "react";
import type { ExpenseItem } from "@/widgets/Loot/GuildLoot/ExpensesTypes";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Button,
} from "@/shared/ui";

const PAGE_SIZE = 10;

export default function UserExpensesTable({
  expenses,
}: {
  expenses: ExpenseItem[];
}) {
  const [page, setPage] = useState(0);

  useEffect(() => {
    setPage(0);
  }, [expenses]);

  if (expenses.length === 0) {
    return <p className="text-sm text-muted-foreground">Пусто</p>;
  }

  const pageCount = Math.ceil(expenses.length / PAGE_SIZE);
  const pageItems = expenses.slice(
    page * PAGE_SIZE,
    page * PAGE_SIZE + PAGE_SIZE,
  );

  return (
    <div className="space-y-2">
      <Table className="table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[20%]">Дата</TableHead>
            <TableHead className="w-[20%]">Сумма</TableHead>
            <TableHead className="w-[25%]">Цель</TableHead>
            <TableHead className="w-[35%]">Комментарий</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pageItems.map((exp) => (
            <TableRow key={exp.id}>
              <TableCell>
                {new Date(exp.date).toLocaleDateString("ru-RU")}
              </TableCell>
              <TableCell>{exp.amount.toLocaleString("ru-RU")}</TableCell>
              <TableCell className="whitespace-normal break-words">
                {exp.target}
              </TableCell>
              <TableCell className="whitespace-normal break-words">
                {exp.comment || "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {pageCount > 1 && (
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-muted-foreground">
            Страница {page + 1} из {pageCount}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
            >
              Назад
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer"
              disabled={page >= pageCount - 1}
              onClick={() => setPage((p) => p + 1)}
            >
              Далее
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
