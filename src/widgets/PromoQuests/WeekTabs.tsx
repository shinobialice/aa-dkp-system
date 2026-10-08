import { cn } from "@/shared/lib/tw-merge";
import { weekDatesLabel, type PromoWeek } from "./promoWeeks";

type Props = {
  weeks: PromoWeek[];
  selected: number;
  running: number | null;
  onSelect: (weekNumber: number) => void;
};

export default function WeekTabs({
  weeks,
  selected,
  running,
  onSelect,
}: Props) {
  return (
    <div
      role="group"
      aria-label="Недели ивента"
      className="grid grid-cols-3 gap-1.5 sm:grid-cols-6"
    >
      {weeks.map((week) => (
        <button
          key={week.number}
          type="button"
          aria-pressed={week.number === selected}
          onClick={() => onSelect(week.number)}
          className={cn(
            "relative flex cursor-pointer flex-col items-center rounded-lg border bg-card px-2 py-1.5 transition-colors hover:bg-accent",
            week.number === selected && "border-primary bg-primary/10",
          )}
        >
          <span className="font-semibold">Неделя {week.number}</span>
          <span className="text-xs text-muted-foreground tabular-nums">
            {weekDatesLabel(week.start)}
          </span>
          {week.number === running && (
            <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-green-500">
              <span className="sr-only">идет сейчас</span>
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
