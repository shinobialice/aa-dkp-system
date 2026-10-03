import { Plus } from "lucide-react";
import { formatNumber, plural } from "@/shared/lib/format";
import { cn } from "@/shared/lib/tw-merge";
import { Button, Card, Skeleton } from "@/shared/ui";
import type { ExpenseItem } from "../../GuildLoot/ExpensesTypes";
import ExpenseRow, { expenseColumns, type ExpenseHandlers } from "./ExpenseRow";

const SKELETON_ROWS = 3;

type Props = ExpenseHandlers & {
  expenses: ExpenseItem[];
  isAdmin: boolean;
  loading: boolean;
  monthLabel: string;
  onAdd: () => void;
};

export default function ExpensesTab({
  expenses,
  isAdmin,
  loading,
  monthLabel,
  onAdd,
  ...handlers
}: Props) {
  return (
    <Card className="gap-0 overflow-hidden p-0">
      <div className="flex flex-wrap items-center justify-between gap-3 p-4">
        <div>
          <h3 className="font-semibold">Расходы за {monthLabel}</h3>
          <p className="text-xs text-muted-foreground">
            {expenses.length}{" "}
            {plural(expenses.length, "запись", "записи", "записей")}
          </p>
        </div>
        {isAdmin && (
          <Button variant="outline" onClick={onAdd}>
            <Plus />
            Добавить расход
          </Button>
        )}
      </div>
      <ExpenseList
        expenses={expenses}
        isAdmin={isAdmin}
        loading={loading}
        monthLabel={monthLabel}
        {...handlers}
      />
    </Card>
  );
}

type ExpenseListProps = ExpenseHandlers & {
  expenses: ExpenseItem[];
  isAdmin: boolean;
  loading: boolean;
  monthLabel: string;
};

function ExpenseList({
  expenses,
  isAdmin,
  loading,
  monthLabel,
  ...handlers
}: ExpenseListProps) {
  if (loading) {
    return (
      <div className="space-y-3 border-t p-4">
        {Array.from({ length: SKELETON_ROWS }, (_, index) => (
          <Skeleton key={index} className="h-10 w-full" />
        ))}
      </div>
    );
  }
  if (expenses.length === 0) {
    return (
      <p className="border-t px-4 py-10 text-center text-sm text-muted-foreground">
        Нет расходов за выбранный период
      </p>
    );
  }

  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  return (
    <>
      <div
        className={cn(
          "hidden items-center gap-4 border-y bg-muted/40 px-4 py-2 text-xs font-medium text-muted-foreground md:grid",
          expenseColumns(isAdmin),
        )}
      >
        <div>Дата</div>
        <div>Цель</div>
        <div>Источник</div>
        <div className="text-right">Сумма</div>
        {isAdmin && <div />}
      </div>
      <ul className="border-t md:border-t-0">
        {expenses.map((expense) => (
          <ExpenseRow
            key={expense.id ?? `${expense.target}-${expense.date}`}
            expense={expense}
            isAdmin={isAdmin}
            {...handlers}
          />
        ))}
      </ul>
      <div className="flex items-baseline justify-between gap-2 bg-muted/40 px-4 py-3 text-sm">
        <span className="text-muted-foreground">Итого за {monthLabel}</span>
        <span className="text-base font-bold tabular-nums">
          {formatNumber(total)}
        </span>
      </div>
    </>
  );
}
