import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/shared/lib/tw-merge";
import {
  eventStyle,
  formatCountdown,
  KIND_LABELS,
  type ScheduleDay,
  type ScheduleEvent,
} from "./scheduleModel";
import { type DayState, EventName } from "./ScheduleParts";
import { NowMarker, withMarker } from "./NowMarker";

export function DayList({ day, state }: { day: ScheduleDay; state: DayState }) {
  const [showPast, setShowPast] = useState(false);
  const { before, after } = withMarker(day, state);
  const showMarker = state.isToday && state.currentMinutes !== null;
  const hidePast = showMarker && before.length > 0 && !showPast;
  const renderEvent = (event: ScheduleEvent, past: boolean) => (
    <li
      key={event.key}
      style={eventStyle(event.name)}
      className={cn(
        "flex min-h-12 items-center gap-3 border-b px-3 py-1.5 last:border-b-0",
        past && "opacity-40",
      )}
    >
      <span className="w-11 shrink-0 text-base font-semibold tabular-nums">
        {event.time}
      </span>
      <span
        className={cn(
          "w-1 self-stretch rounded-full",
          event.kind === "agl"
            ? "bg-muted-foreground/30"
            : "bg-[var(--event-color)] dark:bg-[var(--event-color-dark)]",
        )}
      />
      <span className="flex min-w-0 flex-1 flex-col leading-tight">
        <EventName event={event} />
        <span className="text-xs text-muted-foreground">
          {KIND_LABELS[event.kind]}
        </span>
      </span>
      {!past && showMarker && (
        <span className="shrink-0 text-xs text-muted-foreground">
          {formatCountdown(event.minutes - (state.currentMinutes ?? 0))}
        </span>
      )}
    </li>
  );

  return (
    <ol className="flex flex-col overflow-hidden rounded-xl border bg-card">
      {showMarker && before.length > 0 && (
        <li className="border-b">
          <button
            type="button"
            aria-expanded={showPast}
            onClick={() => setShowPast((value) => !value)}
            className="flex min-h-11 w-full cursor-pointer items-center justify-between gap-2 px-3 text-sm font-medium text-muted-foreground hover:bg-muted/50"
          >
            {showPast ? "Скрыть прошедшие" : `Прошедшие · ${before.length}`}
            <ChevronDown
              className={cn(
                "size-4 transition-transform",
                showPast && "rotate-180",
              )}
            />
          </button>
        </li>
      )}
      {!hidePast && before.map((event) => renderEvent(event, showMarker))}
      {showMarker && <NowMarker minutes={state.currentMinutes ?? 0} />}
      {after.map((event) => renderEvent(event, false))}
      {day.events.length === 0 && (
        <li className="px-3 py-6 text-center text-sm text-muted-foreground">
          В этот день событий нет
        </li>
      )}
    </ol>
  );
}
