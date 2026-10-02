"use client";

import { MoreHorizontal, Pencil, Plus, Trash2 } from "lucide-react";
import {
  Button,
  Card,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  Skeleton,
} from "@/shared/ui";
import { cn } from "@/shared/lib/tw-merge";
import type { ExpenseItem } from "../GuildLoot/ExpensesTypes";
import { formatGold, formatShortDate, plural } from "./treasuryModel";

const ADMIN_COLUMNS = "md:grid-cols-[72px_minmax(0,1fr)_180px_120px_32px]";
const COLUMNS = "md:grid-cols-[72px_minmax(0,1fr)_180px_120px]";

function ExpenseMenu({
  expense,
  onEdit,
  onDelete,
}: {
  expense: ExpenseItem;
  onEdit: (expense: ExpenseItem) => void;
  onDelete: (expense: ExpenseItem) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon-sm"
          className="-my-1 text-muted-foreground"
          aria-label={`Действия с расходом: ${expense.target}`}
        >
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="cursor-pointer" onSelect={() => onEdit(expense)}>
          <Pencil />
          Изменить
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          className="cursor-pointer"
          onSelect={() => onDelete(expense)}
        >
          <Trash2 />
          Удалить…
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ExpensesTab({
  expenses,
  isAdmin,
  loading,
  monthLabel,
  onAdd,
  onEdit,
  onDelete,
}: {
  expenses: ExpenseItem[];
  isAdmin: boolean;
  loading: boolean;
  monthLabel: string;
  onAdd: () => void;
  onEdit: (expense: ExpenseItem) => void;
  onDelete: (expense: ExpenseItem) => void;
}) {
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const columns = isAdmin ? ADMIN_COLUMNS : COLUMNS;

  return (
    <Card className="gap-0 overflow-hidden p-0">
      <div className="flex flex-wrap items-center justify-between gap-3 p-4">
        <div>
          <h3 className="font-semibold">Расходы за {monthLabel}</h3>
          <p className="text-xs text-muted-foreground">
            {expenses.length} {plural(expenses.length, "запись", "записи", "записей")}
          </p>
        </div>
        {isAdmin && (
          <Button variant="outline" onClick={onAdd}>
            <Plus />
            Добавить расход
          </Button>
        )}
      </div>

      {loading ? (
        <div className="space-y-3 border-t p-4">
          {Array.from({ length: 3 }, (_, index) => (
            <Skeleton key={index} className="h-10 w-full" />
          ))}
        </div>
      ) : expenses.length === 0 ? (
        <p className="border-t px-4 py-10 text-center text-sm text-muted-foreground">
          Нет расходов за выбранный период
        </p>
      ) : (
        <>
          <div
            className={cn(
              "hidden items-center gap-4 border-y bg-muted/40 px-4 py-2 text-xs font-medium text-muted-foreground md:grid",
              columns,
            )}
          >
            <div>Дата</div>
            <div>Цель</div>
            <div>Источник</div>
            <div className="text-right">Сумма</div>
            {isAdmin && <div />}
          </div>
          <ul className="border-t md:border-t-0">
            {expenses.map((expense) => {
              const date = formatShortDate(new Date(expense.date));
              return (
                <li key={expense.id ?? `${expense.target}-${date}`} className="border-b">
                  <div
                    className={cn(
                      "hidden items-start gap-4 px-4 py-3 md:grid",
                      columns,
                    )}
                  >
                    <div className="text-muted-foreground tabular-nums">{date}</div>
                    <div className="min-w-0">
                      <p className="font-medium">{expense.target}</p>
                      {expense.comment && (
                        <p className="text-xs text-muted-foreground">
                          «{expense.comment}»
                        </p>
                      )}
                    </div>
                    <div className="truncate">{expense.source}</div>
                    <div className="text-right font-semibold tabular-nums">
                      {formatGold(expense.amount)}
                    </div>
                    {isAdmin && (
                      <ExpenseMenu expense={expense} onEdit={onEdit} onDelete={onDelete} />
                    )}
                  </div>

                  <div className="flex items-start gap-3 px-4 py-3 md:hidden">
                    <div className="min-w-0 flex-1">
                      <p className="font-medium">{expense.target}</p>
                      <p className="text-xs text-muted-foreground">
                        {date} · {expense.source}
                      </p>
                      {expense.comment && (
                        <p className="mt-1 text-xs text-muted-foreground">
                          «{expense.comment}»
                        </p>
                      )}
                    </div>
                    <span className="font-semibold whitespace-nowrap tabular-nums">
                      {formatGold(expense.amount)}
                    </span>
                    {isAdmin && (
                      <ExpenseMenu expense={expense} onEdit={onEdit} onDelete={onDelete} />
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
          <div className="flex items-baseline justify-between gap-2 bg-muted/40 px-4 py-3 text-sm">
            <span className="text-muted-foreground">Итого за {monthLabel}</span>
            <span className="text-base font-bold tabular-nums">{formatGold(total)}</span>
          </div>
        </>
      )}
    </Card>
  );
}
