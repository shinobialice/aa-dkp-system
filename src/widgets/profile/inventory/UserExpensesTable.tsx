"use client";

import { usePagination } from "@/hooks/usePagination";
import TablePager from "./TablePager";
import type { ExpenseItem } from "@/widgets/Loot/GuildLoot/ExpensesTypes";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui";

const PAGE_SIZE = 10;

export default function UserExpensesTable({
  expenses,
}: {
  expenses: ExpenseItem[];
}) {
  const { page, setPage, pageCount, pageItems } = usePagination(
    expenses,
    PAGE_SIZE,
  );

  if (expenses.length === 0) {
    return <p className="text-sm text-muted-foreground">Пусто</p>;
  }

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

      <TablePager page={page} pageCount={pageCount} onPageChange={setPage} />
    </div>
  );
}
