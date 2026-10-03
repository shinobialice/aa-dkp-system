import { ChevronDown } from "lucide-react";
import { formatNumber } from "@/shared/lib/format";
import { cn } from "@/shared/lib/tw-merge";
import { Button } from "@/shared/ui";
import { LootIcon } from "../../LootBuy/icons/LootIconComponent";
import type { StockGroup } from "../stockModel";
import LotChips, { lotsLabel } from "./LotChips";
import StockAge from "./StockAge";
import StockRowActions, { type StockActions } from "./StockRowActions";
import UnitPrice from "./UnitPrice";

type Props = StockActions & {
  group: StockGroup;
  isAdmin: boolean;
  open: boolean;
  onToggle: () => void;
  onExpand: () => void;
};

export default function StockCard({
  group,
  isAdmin,
  open,
  onToggle,
  onExpand,
  ...actions
}: Props) {
  const unit =
    group.unitPrice !== null ? ` × ${formatNumber(group.unitPrice)}` : "";
  const meta = [group.sources.join(", "), `${group.quantity} шт.${unit}`]
    .filter(Boolean)
    .join(" · ");

  return (
    <article className="flex flex-col gap-3 rounded-xl border bg-card p-3">
      <div className="flex items-start gap-3">
        <LootIcon
          itemName={group.name}
          iconUrl={group.iconUrl}
          grade={group.grade}
          size={44}
        />
        <div className="min-w-0 flex-1 space-y-0.5">
          <p className="leading-snug font-semibold">{group.name}</p>
          <p className="text-sm text-muted-foreground">{meta}</p>
          <StockAge group={group} />
        </div>
        <p className="font-bold whitespace-nowrap tabular-nums">
          {group.value !== null && formatNumber(group.value)}
          {group.value === null && (
            <UnitPrice
              group={group}
              isAdmin={isAdmin}
              onEditPrice={actions.onEditPrice}
            />
          )}
        </p>
      </div>
      <div className="flex items-center justify-between gap-2">
        <Button
          variant="ghost"
          size="sm"
          className={cn("-ml-2 text-muted-foreground", isAdmin && "h-11")}
          aria-expanded={open}
          onClick={onToggle}
        >
          {lotsLabel(group.lots.length)}
          <ChevronDown
            className={cn("transition-transform", open && "rotate-180")}
          />
        </Button>
        {isAdmin && (
          <StockRowActions
            group={group}
            large
            onExpand={onExpand}
            {...actions}
          />
        )}
      </div>
      {open && (
        <LotChips
          group={group}
          isAdmin={isAdmin}
          onDeleteLot={actions.onDeleteLot}
        />
      )}
    </article>
  );
}
