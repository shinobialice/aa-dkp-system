"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/shared/lib/tw-merge";
import {
  eventStyle,
  formatClock,
  formatCountdown,
  formatDayDate,
  KIND_LABELS,
  type ScheduleDay,
  type ScheduleEvent,
} from "./scheduleModel";

export type DayState = {
  isToday: boolean;
  currentMinutes: number | null;
};

const KIND_TEXT: Record<ScheduleEvent["kind"], string> = {
  prime:
    "font-bold text-[var(--event-color)] dark:text-[var(--event-color-dark)]",
  event:
    "font-semibold text-[var(--event-color)] dark:text-[var(--event-color-dark)]",
  agl: "font-medium text-muted-foreground",
};

const KIND_BG: Record<ScheduleEvent["kind"], string> = {
  prime:
    "bg-[color-mix(in_srgb,var(--event-color)_10%,transparent)] dark:bg-[color-mix(in_srgb,var(--event-color-dark)_14%,transparent)]",
  event:
    "bg-[color-mix(in_srgb,var(--event-color)_7%,transparent)] dark:bg-[color-mix(in_srgb,var(--event-color-dark)_10%,transparent)]",
  agl: "",
};

export function EventName({
  event,
  className,
}: {
  event: ScheduleEvent;
  className?: string;
}) {
  return (
    <span
      style={eventStyle(event.name)}
      className={cn(KIND_TEXT[event.kind], className)}
    >
      {event.name}
    </span>
  );
}

function NowMarker({ minutes, wide }: { minutes: number; wide?: boolean }) {
  return (
    <li
      aria-label={`Сейчас ${formatClock(minutes)}`}
      className={cn(
        "flex items-center gap-1.5 font-bold text-red-600 dark:text-red-400",
        wide
          ? "px-1 py-0.5 text-[11px]"
          : "bg-red-50 px-3 py-1 text-xs dark:bg-red-500/10",
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {wide ? formatClock(minutes) : `Сейчас ${formatClock(minutes)}`}
      <span className="h-px flex-1 bg-current opacity-60" />
    </li>
  );
}

function withMarker(day: ScheduleDay, state: DayState) {
  if (!state.isToday || state.currentMinutes === null) {
    return { before: day.events, after: [] as ScheduleEvent[] };
  }
  const index = day.events.findIndex(
    (event) => event.minutes >= (state.currentMinutes ?? 0),
  );
  if (index === -1) return { before: day.events, after: [] };
  return { before: day.events.slice(0, index), after: day.events.slice(index) };
}

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
            <span className="w-[34px] shrink-0 text-xs leading-5 text-muted-foreground tabular-nums">
              {event.time}
            </span>
            <EventName
              event={event}
              className="min-w-0 text-[12.5px] leading-5"
            />
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
              <span className="truncate text-[13.5px] font-bold">
                {day.name}
              </span>
              {day.date && (
                <span className="text-[11.5px] font-medium opacity-80">
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
      <span className="w-11 shrink-0 text-[15px] font-semibold tabular-nums">
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
            className="flex min-h-11 w-full cursor-pointer items-center justify-between gap-2 px-3 text-[13px] font-medium text-muted-foreground hover:bg-muted/50"
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
