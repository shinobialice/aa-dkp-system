import { cn } from "@/shared/lib/tw-merge";
import {
  formatClock,
  type ScheduleDay,
  type ScheduleEvent,
} from "./scheduleModel";
import { type DayState } from "./ScheduleParts";

export function NowMarker({
  minutes,
  wide,
}: {
  minutes: number;
  wide?: boolean;
}) {
  return (
    <li
      aria-label={`Сейчас ${formatClock(minutes)}`}
      className={cn(
        "flex items-center gap-1.5 font-bold text-red-600 dark:text-red-400",
        wide
          ? "px-1 py-0.5 text-2xs"
          : "bg-red-50 px-3 py-1 text-xs dark:bg-red-500/10",
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {wide ? formatClock(minutes) : `Сейчас ${formatClock(minutes)}`}
      <span className="h-px flex-1 bg-current opacity-60" />
    </li>
  );
}

export function withMarker(day: ScheduleDay, state: DayState) {
  if (!state.isToday || state.currentMinutes === null) {
    return { before: day.events, after: [] as ScheduleEvent[] };
  }
  const index = day.events.findIndex(
    (event) => event.minutes >= (state.currentMinutes ?? 0),
  );
  if (index === -1) return { before: day.events, after: [] };
  return { before: day.events.slice(0, index), after: day.events.slice(index) };
}
