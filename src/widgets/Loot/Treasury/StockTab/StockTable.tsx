import { formatNumber } from "@/shared/lib/format";
import { cn } from "@/shared/lib/tw-merge";
import type { StockGroup } from "../stockModel";
import type { StockActions } from "./StockRowActions";
import StockTableRow, { stockColumns } from "./StockTableRow";

type Props = StockActions & {
  groups: StockGroup[];
  isAdmin: boolean;
  expanded: number | null;
  summaryText: string;
  summaryValue: number;
  onToggle: (itemTypeId: number) => void;
  onExpand: (itemTypeId: number) => void;
};

export default function StockTable({
  groups,
  isAdmin,
  expanded,
  summaryText,
  summaryValue,
  onToggle,
  onExpand,
  ...actions
}: Props) {
  return (
    <div className="hidden rounded-xl border bg-card xl:block">
      <div
        className={cn(
          "grid items-center gap-4 rounded-t-xl border-b bg-muted/40 px-4 py-2.5 text-xs font-medium text-muted-foreground",
          stockColumns(isAdmin),
        )}
      >
        <div className="pl-18.5">Предмет</div>
        <div>Босс</div>
        <div className="text-right">Кол-во</div>
        <div className="text-right">Цена за шт.</div>
        <div className="text-right">Стоимость</div>
        <div>Лежит</div>
        {isAdmin && <div />}
      </div>

      {groups.map((group) => (
        <StockTableRow
          key={group.itemTypeId}
          group={group}
          isAdmin={isAdmin}
          open={expanded === group.itemTypeId}
          onToggle={() => onToggle(group.itemTypeId)}
          onExpand={() => onExpand(group.itemTypeId)}
          {...actions}
        />
      ))}

      <div className="flex flex-wrap items-center justify-between gap-2 rounded-b-xl bg-muted/40 px-4 py-3 text-sm">
        <span className="text-muted-foreground">{summaryText}</span>
        <span className="flex items-baseline gap-2">
          <span className="text-muted-foreground">Стоимость</span>
          <span className="text-base font-bold tabular-nums">
            {formatNumber(summaryValue)}
          </span>
        </span>
      </div>
    </div>
  );
}
