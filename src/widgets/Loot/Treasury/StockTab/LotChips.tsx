import { X } from "lucide-react";
import { plural } from "@/shared/lib/format";
import { cn } from "@/shared/lib/tw-merge";
import type { StockGroup, StockLot } from "../stockModel";
import { formatDate, formatShortDate } from "../treasuryModel";

export function lotsLabel(count: number) {
  return `${count} ${plural(count, "дроп", "дропа", "дропов")}`;
}

type Props = {
  group: StockGroup;
  isAdmin: boolean;
  onDeleteLot: (group: StockGroup, lot: StockLot) => void;
};

export default function LotChips({ group, isAdmin, onDeleteLot }: Props) {
  return (
    <div className="space-y-2">
      <p className="text-xs text-muted-foreground">
        Дропы на складе, сначала старые — при продаже спишутся по порядку
      </p>
      <ul className="flex flex-wrap gap-1.5">
        {group.lots.map((lot) => {
          const date = lot.acquiredAt
            ? formatDate(lot.acquiredAt)
            : "дата не указана";
          return (
            <li
              key={lot.id}
              title={`${lot.source ?? "Источник не указан"}, ${date}`}
              className={cn(
                "inline-flex h-7 items-center gap-1 rounded-md border bg-background text-xs tabular-nums",
                isAdmin ? "pr-0.5 pl-2" : "px-2",
              )}
            >
              {lot.acquiredAt ? formatShortDate(lot.acquiredAt) : "—"}
              {lot.quantity > 1 && (
                <span className="text-muted-foreground">×{lot.quantity}</span>
              )}
              {isAdmin && (
                <button
                  type="button"
                  aria-label={`Удалить дроп от ${date}`}
                  onClick={() => onDeleteLot(group, lot)}
                  className="ml-0.5 flex size-6 cursor-pointer items-center justify-center rounded text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
