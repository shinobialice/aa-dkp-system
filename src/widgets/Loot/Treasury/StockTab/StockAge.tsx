import { Clock } from "lucide-react";
import { cn } from "@/shared/lib/tw-merge";
import type { StockGroup } from "../stockModel";
import { formatDate, formatShortDate } from "../treasuryModel";

type Props = {
  group: StockGroup;
};

export default function StockAge({ group }: Props) {
  if (group.ageDays === null || !group.oldestAt) {
    return <span className="text-muted-foreground">—</span>;
  }

  return (
    <span
      className="inline-flex items-center gap-1.5 text-sm whitespace-nowrap tabular-nums"
      title={`Самый старый дроп получен ${formatDate(group.oldestAt)}`}
    >
      {group.isStale && (
        <Clock
          className="size-3.5 text-amber-600 dark:text-amber-400"
          aria-hidden
        />
      )}
      <span
        className={cn(
          group.isStale && "font-semibold text-amber-700 dark:text-amber-400",
        )}
      >
        {group.ageDays} дн.
      </span>
      <span className="text-muted-foreground">
        с {formatShortDate(group.oldestAt)}
      </span>
    </span>
  );
}
