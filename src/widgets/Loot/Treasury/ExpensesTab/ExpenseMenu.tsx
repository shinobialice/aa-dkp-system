import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui";
import type { ExpenseItem } from "../../GuildLoot/ExpensesTypes";

type Props = {
  expense: ExpenseItem;
  onEdit: (expense: ExpenseItem) => void;
  onDelete: (expense: ExpenseItem) => void;
};

export default function ExpenseMenu({ expense, onEdit, onDelete }: Props) {
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
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={() => onEdit(expense)}
        >
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
