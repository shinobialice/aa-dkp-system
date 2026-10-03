import { formatNumber } from "@/shared/lib/format";
import { cn } from "@/shared/lib/tw-merge";
import type { ExpenseItem } from "../../GuildLoot/ExpensesTypes";
import { formatShortDate } from "../treasuryModel";
import ExpenseMenu from "./ExpenseMenu";

const ADMIN_COLUMNS = "md:grid-cols-[72px_minmax(0,1fr)_180px_120px_32px]";
const COLUMNS = "md:grid-cols-[72px_minmax(0,1fr)_180px_120px]";

export function expenseColumns(isAdmin: boolean) {
  return isAdmin ? ADMIN_COLUMNS : COLUMNS;
}

export type ExpenseHandlers = {
  onEdit: (expense: ExpenseItem) => void;
  onDelete: (expense: ExpenseItem) => void;
};

type Props = ExpenseHandlers & {
  expense: ExpenseItem;
  isAdmin: boolean;
};

export default function ExpenseRow({
  expense,
  isAdmin,
  onEdit,
  onDelete,
}: Props) {
  const date = formatShortDate(new Date(expense.date));
  const menu = isAdmin && (
    <ExpenseMenu expense={expense} onEdit={onEdit} onDelete={onDelete} />
  );
  const comment = expense.comment && `«${expense.comment}»`;

  return (
    <li className="border-b">
      <div
        className={cn(
          "hidden items-start gap-4 px-4 py-3 md:grid",
          expenseColumns(isAdmin),
        )}
      >
        <div className="text-muted-foreground tabular-nums">{date}</div>
        <div className="min-w-0">
          <p className="font-medium">{expense.target}</p>
          {comment && (
            <p className="text-xs text-muted-foreground">{comment}</p>
          )}
        </div>
        <div className="truncate">{expense.source}</div>
        <div className="text-right font-semibold tabular-nums">
          {formatNumber(expense.amount)}
        </div>
        {menu}
      </div>

      <div className="flex items-start gap-3 px-4 py-3 md:hidden">
        <div className="min-w-0 flex-1">
          <p className="font-medium">{expense.target}</p>
          <p className="text-xs text-muted-foreground">
            {date} · {expense.source}
          </p>
          {comment && (
            <p className="mt-1 text-xs text-muted-foreground">{comment}</p>
          )}
        </div>
        <span className="font-semibold whitespace-nowrap tabular-nums">
          {formatNumber(expense.amount)}
        </span>
        {menu}
      </div>
    </li>
  );
}
