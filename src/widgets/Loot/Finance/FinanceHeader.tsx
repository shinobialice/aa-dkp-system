import { ChevronLeft, ChevronRight, Loader2, RefreshCw } from "lucide-react";
import { MONTH_NAMES } from "@/shared/config/months";
import { Button } from "@/shared/ui";

type Props = {
  month: number;
  year: number;
  isAdmin: boolean;
  isLatestMonth: boolean;
  recalculating: boolean;
  updatedAt: Date | null;
  onShiftMonth: (delta: number) => void;
  onRecalculate: () => void;
};

export default function FinanceHeader({
  month,
  year,
  isAdmin,
  isLatestMonth,
  recalculating,
  updatedAt,
  onShiftMonth,
  onRecalculate,
}: Props) {
  const periodLabel = `${MONTH_NAMES[month - 1]} ${year}`;

  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Финансы</h1>
        <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
          Доход гильдии, казна и зарплаты
          <RefreshStatus recalculating={recalculating} updatedAt={updatedAt} />
        </p>
      </div>
      <div className="flex items-center gap-2">
        {isAdmin && (
          <div className="inline-flex h-10 items-center rounded-lg border bg-background">
            <button
              type="button"
              onClick={() => onShiftMonth(-1)}
              aria-label="Предыдущий месяц"
              className="flex size-10 cursor-pointer items-center justify-center rounded-l-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
            >
              <ChevronLeft className="size-4" />
            </button>
            <span className="min-w-32 text-center text-sm font-semibold">
              {periodLabel}
            </span>
            <button
              type="button"
              onClick={() => onShiftMonth(1)}
              disabled={isLatestMonth}
              aria-label="Следующий месяц"
              className="flex size-10 cursor-pointer items-center justify-center rounded-r-lg text-muted-foreground transition-colors hover:bg-accent hover:text-foreground disabled:cursor-default disabled:opacity-40 disabled:hover:bg-transparent"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        )}
        {!isAdmin && (
          <span className="inline-flex h-10 items-center rounded-lg border px-3 text-sm font-semibold">
            {periodLabel}
          </span>
        )}
        {isAdmin && (
          <Button
            variant="outline"
            onClick={onRecalculate}
            disabled={recalculating}
            className="h-10 cursor-pointer"
          >
            <RefreshCw className={recalculating ? "animate-spin" : undefined} />
            Пересчитать
          </Button>
        )}
      </div>
    </div>
  );
}

type RefreshStatusProps = {
  recalculating: boolean;
  updatedAt: Date | null;
};

function RefreshStatus({ recalculating, updatedAt }: RefreshStatusProps) {
  if (recalculating) {
    return (
      <>
        · <Loader2 className="size-3.5 animate-spin" /> пересчёт…
      </>
    );
  }
  if (!updatedAt) return null;
  const time = updatedAt.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
  return <> · обновлено в {time}</>;
}
