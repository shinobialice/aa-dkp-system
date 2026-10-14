import type { PromoQuest } from "@/shared/config/promoQuests";
import { cn } from "@/shared/lib/tw-merge";
import {
  dayScore,
  fullDayScore,
  goalPercent,
  type DoneMarks,
} from "./promoQuestsModel";
import { formatDayNumber, type PromoDay } from "./promoWeeks";

type Props = {
  days: PromoDay[];
  quests: PromoQuest[];
  characterId: number | null;
  marks: DoneMarks;
  todayIndex: number | null;
  selected: number;
  onSelect: (dayIndex: number) => void;
};

export default function DayStrip({
  days,
  quests,
  characterId,
  marks,
  todayIndex,
  selected,
  onSelect,
}: Props) {
  const perDay = fullDayScore(quests);

  return (
    <div
      role="group"
      aria-label="День недели"
      className="promo-rise grid grid-cols-7 gap-1.5 sm:gap-2"
    >
      {days.map((day) => {
        const score = dayScore(marks, characterId, quests, day.index);
        const isToday = day.index === todayIndex;
        return (
          <button
            key={day.key}
            type="button"
            aria-pressed={day.index === selected}
            onClick={() => onSelect(day.index)}
            className={cn(
              "relative flex cursor-pointer flex-col items-center gap-1 rounded-xl border bg-card px-1 pt-2 pb-1.5 transition-[translate,box-shadow,border-color] hover:-translate-y-0.5 hover:shadow-md",
              day.index === selected &&
                "border-amber-500 shadow-md ring-2 ring-amber-500/25",
            )}
          >
            <span
              className={cn(
                "text-xs font-semibold",
                isToday && "text-amber-600 dark:text-amber-400",
              )}
            >
              {day.name}
            </span>
            <span className="relative h-14 w-3 overflow-hidden rounded-full bg-muted sm:w-4">
              <span
                className={cn(
                  "absolute inset-x-0 bottom-0 rounded-full bg-gradient-to-t transition-[height] duration-500 ease-out",
                  score === perDay
                    ? "from-emerald-600 to-emerald-300"
                    : "from-orange-500 to-amber-300",
                )}
                style={{ height: `${goalPercent(score, perDay)}%` }}
              />
            </span>
            <span className="text-xs font-bold tabular-nums">{score}</span>
            <span className="hidden text-2xs text-muted-foreground tabular-nums sm:block">
              {formatDayNumber(day.key)}
            </span>
            {isToday && (
              <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-amber-500 motion-safe:animate-pulse">
                <span className="sr-only">сегодня</span>
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
