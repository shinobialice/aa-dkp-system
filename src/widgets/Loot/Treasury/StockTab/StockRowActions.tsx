import { Gift, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/shared/lib/tw-merge";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui";
import type { StockGroup, StockLot } from "../stockModel";

export type StockActions = {
  onSell: (group: StockGroup) => void;
  onGive: (group: StockGroup) => void;
  onEditPrice: (group: StockGroup) => void;
  onDeleteLot: (group: StockGroup, lot: StockLot) => void;
};

type Props = StockActions & {
  group: StockGroup;
  large?: boolean;
  onExpand: () => void;
};

export default function StockRowActions({
  group,
  large,
  onExpand,
  onSell,
  onGive,
  onEditPrice,
  onDeleteLot,
}: Props) {
  const single = group.lots.length === 1;
  const handleDelete = () => {
    if (single) onDeleteLot(group, group.lots[0]);
    else onExpand();
  };

  return (
    <div className="flex items-center justify-end gap-1.5">
      <Button
        variant="outline"
        size="sm"
        className={cn(large && "h-11 px-4")}
        onClick={() => onSell(group)}
      >
        Продать
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon-sm"
            className={cn("text-muted-foreground", large && "size-11")}
            aria-label={`Ещё действия: ${group.name}`}
          >
            <MoreHorizontal />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={() => onGive(group)}
          >
            <Gift />
            Выдать бесплатно
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={() => onEditPrice(group)}
          >
            <Pencil />
            Изменить цену за шт.
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            className="cursor-pointer"
            onSelect={handleDelete}
          >
            <Trash2 />
            {single ? "Удалить…" : "Удалить дроп…"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
