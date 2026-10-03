import { ChevronRight } from "lucide-react";
import { formatNumber } from "@/shared/lib/format";
import { cn } from "@/shared/lib/tw-merge";
import { Button } from "@/shared/ui";
import { LootIcon } from "../../LootBuy/icons/LootIconComponent";
import type { StockGroup } from "../stockModel";
import LotChips, { lotsLabel } from "./LotChips";
import StockAge from "./StockAge";
import StockRowActions, { type StockActions } from "./StockRowActions";
import UnitPrice from "./UnitPrice";

const ADMIN_COLUMNS =
  "grid-cols-[minmax(0,2.6fr)_minmax(0,1fr)_56px_96px_104px_132px_136px]";
const COLUMNS =
  "grid-cols-[minmax(0,2.6fr)_minmax(0,1fr)_56px_96px_104px_132px]";

export function stockColumns(isAdmin: boolean) {
  return isAdmin ? ADMIN_COLUMNS : COLUMNS;
}

type Props = StockActions & {
  group: StockGroup;
  isAdmin: boolean;
  open: boolean;
  onToggle: () => void;
  onExpand: () => void;
};

export default function StockTableRow({
  group,
  isAdmin,
  open,
  onToggle,
  onExpand,
  ...actions
}: Props) {
  const sources = group.sources.join(", ");

  return (
    <div className="border-b">
      <div
        className={cn(
          "grid min-h-15 items-center gap-4 px-4 py-2",
          stockColumns(isAdmin),
        )}
      >
        <div className="flex min-w-0 items-center gap-2.5">
          <Button
            variant="ghost"
            size="icon-sm"
            className="size-7 text-muted-foreground"
            aria-expanded={open}
            aria-label={open ? "Скрыть дропы" : "Показать дропы"}
            onClick={onToggle}
          >
            <ChevronRight
              className={cn("transition-transform", open && "rotate-90")}
            />
          </Button>
          <LootIcon
            itemName={group.name}
            iconUrl={group.iconUrl}
            grade={group.grade}
            size={36}
          />
          <div className="min-w-0">
            <p className="leading-snug font-medium">{group.name}</p>
            <p className="text-xs text-muted-foreground">
              {lotsLabel(group.lots.length)}
            </p>
          </div>
        </div>
        <div className="truncate text-sm text-muted-foreground" title={sources}>
          {sources || "—"}
        </div>
        <div className="text-right tabular-nums">{group.quantity}</div>
        <div className="text-right text-sm tabular-nums">
          <UnitPrice
            group={group}
            isAdmin={isAdmin}
            onEditPrice={actions.onEditPrice}
          />
        </div>
        <div className="text-right font-semibold tabular-nums">
          {group.value === null ? "—" : formatNumber(group.value)}
        </div>
        <StockAge group={group} />
        {isAdmin && (
          <StockRowActions group={group} onExpand={onExpand} {...actions} />
        )}
      </div>
      {open && (
        <div className="px-4 pb-4 pl-22.5">
          <LotChips
            group={group}
            isAdmin={isAdmin}
            onDeleteLot={actions.onDeleteLot}
          />
        </div>
      )}
    </div>
  );
}
