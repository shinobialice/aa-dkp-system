import { Clock } from "lucide-react";
import { plural } from "@/shared/lib/format";
import { STALE_DAYS } from "../stockModel";

type Props = {
  staleCount: number;
  onShowStale: () => void;
};

export default function StaleStockFooter({ staleCount, onShowStale }: Props) {
  if (staleCount === 0) {
    return (
      <span className="text-muted-foreground">
        Дольше {STALE_DAYS} дней ничего не лежит
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={onShowStale}
      className="inline-flex cursor-pointer items-center gap-1.5 font-medium text-amber-700 hover:underline dark:text-amber-400"
    >
      <Clock className="size-3.5 shrink-0" aria-hidden />
      <span className="sm:hidden">
        {staleCount} {plural(staleCount, "лежит", "лежат", "лежат")}{" "}
        {STALE_DAYS}+ дн.
      </span>
      <span className="hidden sm:inline">
        {staleCount}{" "}
        {plural(staleCount, "позиция лежит", "позиции лежат", "позиций лежат")}{" "}
        дольше {STALE_DAYS} дней
      </span>
    </button>
  );
}
