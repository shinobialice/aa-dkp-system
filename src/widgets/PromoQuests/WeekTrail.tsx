import { Flag } from "lucide-react";
import { cn } from "@/shared/lib/tw-merge";
import {
  trailPercent,
  weekDatesLabel,
  weekStage,
  type PromoWeek,
  type WeekStage,
} from "./promoWeeks";

type Props = {
  weeks: PromoWeek[];
  selected: number;
  todayKey: string;
  onSelect: (weekNumber: number) => void;
};

const NODE_CLASS: Record<WeekStage, string> = {
  past: "border-amber-500 bg-gradient-to-br from-amber-400 to-orange-500 text-white",
  running: "border-amber-500 bg-card text-amber-600 dark:text-amber-400",
  upcoming: "border-border bg-card text-muted-foreground",
};

export default function WeekTrail({
  weeks,
  selected,
  todayKey,
  onSelect,
}: Props) {
  const progress = trailPercent(weeks, todayKey);

  return (
    <div className="promo-rise relative pt-1">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-5.5 h-1.5 -translate-y-1/2 rounded-full bg-muted"
      >
        <div
          className="relative h-full rounded-full bg-gradient-to-r from-amber-300 via-orange-500 to-rose-500 transition-[width] duration-1000"
          style={{ width: `${progress}%` }}
        >
          {progress > 0 && progress < 100 && (
            <span className="absolute top-1/2 right-0 size-3 translate-x-1/2 -translate-y-1/2 rounded-full bg-rose-500 shadow-[0_0_10px] shadow-rose-500 motion-safe:animate-pulse" />
          )}
        </div>
        <Flag className="absolute right-0 bottom-2.5 size-4 text-rose-500" />
      </div>
      <div
        role="group"
        aria-label="Недели ивента"
        className="relative grid grid-cols-6"
      >
        {weeks.map((week) => {
          const stage = weekStage(week, todayKey);
          const isSelected = week.number === selected;
          return (
            <button
              key={week.number}
              type="button"
              aria-pressed={isSelected}
              aria-label={`Неделя ${week.number}, ${weekDatesLabel(week.start)}`}
              onClick={() => onSelect(week.number)}
              className="group flex cursor-pointer flex-col items-center gap-1.5 rounded-lg pb-1 outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              <span
                className={cn(
                  "relative grid size-9 place-items-center rounded-full border-2 text-sm font-bold shadow-sm transition-[scale,box-shadow] group-hover:scale-110",
                  NODE_CLASS[stage],
                  isSelected &&
                    "scale-115 shadow-md ring-4 ring-amber-500/25 group-hover:scale-115",
                )}
              >
                {stage === "running" && (
                  <span className="absolute -inset-0.5 rounded-full border-2 border-amber-500 motion-safe:animate-ping" />
                )}
                {week.number}
              </span>
              <span
                className={cn(
                  "hidden text-xs tabular-nums sm:block",
                  isSelected
                    ? "font-semibold text-foreground"
                    : "text-muted-foreground",
                )}
              >
                {weekDatesLabel(week.start)}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
