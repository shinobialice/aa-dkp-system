import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = {
  label: string;
  canGoBack: boolean;
  canGoForward: boolean;
  onShift: (delta: number) => void;
};

const ARROW_CLASS =
  "grid size-9 cursor-pointer place-items-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground disabled:cursor-default disabled:opacity-30 disabled:hover:bg-transparent";

export default function PeriodSwitcher({
  label,
  canGoBack,
  canGoForward,
  onShift,
}: Props) {
  return (
    <div
      aria-label="Период"
      className="inline-flex items-center rounded-lg border bg-card"
    >
      <button
        type="button"
        aria-label="Предыдущий месяц"
        disabled={!canGoBack}
        onClick={() => onShift(-1)}
        className={ARROW_CLASS}
      >
        <ChevronLeft className="size-4" />
      </button>
      <span className="min-w-36 text-center font-semibold tabular-nums">
        {label}
      </span>
      <button
        type="button"
        aria-label="Следующий месяц"
        disabled={!canGoForward}
        onClick={() => onShift(1)}
        className={ARROW_CLASS}
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}
