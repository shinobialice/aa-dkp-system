import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { MONTH_NAMES, type YearMonth } from "@/shared/config/months";

const ICON_BUTTON =
  "flex size-7 cursor-pointer items-center justify-center rounded-md text-muted-foreground hover:bg-background/70 hover:text-foreground";

type Props = {
  month: YearMonth;
  canGoNext: boolean;
  canAdd: boolean;
  onShift: (delta: number) => void;
  onAddToggle: () => void;
};

export default function MissingMonthSwitcher({
  month,
  canGoNext,
  canAdd,
  onShift,
  onAddToggle,
}: Props) {
  return (
    <div className="ml-auto flex items-center gap-0.5">
      <button
        type="button"
        onClick={() => onShift(-1)}
        aria-label="Предыдущий месяц"
        className={ICON_BUTTON}
      >
        <ChevronLeft className="size-3.5" />
      </button>
      <span className="min-w-22 text-center text-xs font-medium tabular-nums">
        {MONTH_NAMES[month.month - 1]} {month.year}
      </span>
      <button
        type="button"
        onClick={() => onShift(1)}
        disabled={!canGoNext}
        aria-label="Следующий месяц"
        className={`${ICON_BUTTON} disabled:cursor-default disabled:opacity-40 disabled:hover:bg-transparent`}
      >
        <ChevronRight className="size-3.5" />
      </button>
      {canAdd && (
        <button
          type="button"
          onClick={onAddToggle}
          aria-label="Добавить пункт"
          title="Добавить пункт"
          className={ICON_BUTTON}
        >
          <Plus className="size-4" />
        </button>
      )}
    </div>
  );
}
