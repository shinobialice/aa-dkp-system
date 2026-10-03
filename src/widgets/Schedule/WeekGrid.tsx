import { cn } from "@/shared/lib/tw-merge";
import {
  eventStyle,
  formatDayDate,
  type ScheduleDay,
  type ScheduleEvent,
} from "./scheduleModel";
import { type DayState, EventName } from "./ScheduleParts";
import { KIND_BG } from "./scheduleStyles";
import { NowMarker, withMarker } from "./NowMarker";

export function WeekGrid({
  week,
  dayStates,
}: {
  week: ScheduleDay[];
  dayStates: DayState[];
}) {
  return (
    <div className="grid grid-cols-7 items-start gap-2">
      {week.map((day) => {
        const state = dayStates[day.index];
        const { before, after } = withMarker(day, state);
        const showMarker = state.isToday && state.currentMinutes !== null;
        const renderEvent = (event: ScheduleEvent, past: boolean) => (
          <li
            key={event.key}
            style={eventStyle(event.name)}
            className={cn(
              "flex gap-1.5 rounded-md px-1.5 py-1",
              KIND_BG[event.kind],
              past && "opacity-40",
            )}
          >
            <span className="w-8.5 shrink-0 text-xs leading-5 text-muted-foreground tabular-nums">
              {event.time}
            </span>
            <EventName event={event} className="min-w-0 text-xs leading-5" />
          </li>
        );
        return (
          <section
            key={day.name}
            aria-label={day.name}
            className={cn(
              "flex min-w-0 flex-col overflow-hidden rounded-xl border bg-card",
              state.isToday && "border-green-300 dark:border-green-500/40",
            )}
          >
            <div
              className={cn(
                "flex flex-col px-2.5 py-1.5 leading-tight",
                state.isToday
                  ? "bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-300"
                  : "bg-muted/50",
              )}
            >
              <span className="truncate text-sm font-bold">{day.name}</span>
              {day.date && (
                <span className="text-2xs font-medium opacity-80">
                  {formatDayDate(day.date)}
                </span>
              )}
            </div>
            <ol className="flex flex-col gap-0.5 p-1">
              {before.map((event) => renderEvent(event, showMarker))}
              {showMarker && (
                <NowMarker minutes={state.currentMinutes ?? 0} wide />
              )}
              {after.map((event) => renderEvent(event, false))}
              {day.events.length === 0 && (
                <li className="px-1.5 py-3 text-center text-xs text-muted-foreground">
                  Нет событий
                </li>
              )}
            </ol>
          </section>
        );
      })}
    </div>
  );
}
