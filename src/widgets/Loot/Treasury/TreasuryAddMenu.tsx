import type { ReactNode } from "react";
import {
  ArrowDownLeft,
  ChevronDown,
  Landmark,
  Minus,
  Plus,
} from "lucide-react";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui";

type Props = {
  onAddDrop: () => void;
  onAddTreasury: () => void;
  onAddExpense: () => void;
};

export default function TreasuryAddMenu({
  onAddDrop,
  onAddTreasury,
  onAddExpense,
}: Props) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button>
          <Plus />
          Добавить
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <AddMenuItem
          icon={<ArrowDownLeft className="text-blue-600 dark:text-blue-400" />}
          title="Дроп с босса"
          hint="Предмет попадёт на склад"
          onSelect={onAddDrop}
        />
        <AddMenuItem
          icon={<Landmark className="text-orange-600 dark:text-orange-400" />}
          title="Золото в казну"
          hint="Сразу деньгами, без предмета"
          onSelect={onAddTreasury}
        />
        <AddMenuItem
          icon={<Minus />}
          title="Расход"
          hint="Покупки, пробуды, награды"
          onSelect={onAddExpense}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type AddMenuItemProps = {
  icon: ReactNode;
  title: string;
  hint: string;
  onSelect: () => void;
};

function AddMenuItem({ icon, title, hint, onSelect }: AddMenuItemProps) {
  return (
    <DropdownMenuItem
      className="cursor-pointer items-start gap-3 py-2"
      onSelect={onSelect}
    >
      <span className="mt-0.5">{icon}</span>
      <span className="flex flex-col">
        <span className="font-medium">{title}</span>
        <span className="text-xs text-muted-foreground">{hint}</span>
      </span>
    </DropdownMenuItem>
  );
}
