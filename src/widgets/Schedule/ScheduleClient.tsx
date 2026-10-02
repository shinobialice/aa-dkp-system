"use client";

import { useState } from "react";
import { cn } from "@/shared/lib/tw-merge";
import { useMinuteNow } from "@/widgets/War/warModel";
import { DayList, EventName, WeekGrid, type DayState } from "./ScheduleParts";
import {
  buildWeek,
  dayLabel,
  eventStyle,
  eventsCount,
  formatClock,
  formatCountdown,
  formatDayDate,
  moscowClock,
  upcomingEvents,
  type EventKind,
  type KindFilter,
  type ScheduleMap,
} from "./scheduleModel";

const FILTERS: { kind: EventKind; label: string; dot: string }[] = [
  { kind: "prime", label: "Праймы", dot: "bg-red-600" },
  { kind: "event", label: "Ивенты", dot: "bg-stone-500" },
  { kind: "agl", label: "АГЛ и Кошка", dot: "bg-zinc-400" },
];

export default function ScheduleClient({
  schedule,
}: {
  schedule: ScheduleMap;
}) {
  const now = useMinuteNow();
  const [filter, setFilter] = useState<KindFilter>({
    prime: true,
    event: true,
    agl: true,
  });
  const [pickedDay, setPickedDay] = useState<number | null>(null);

  const clock = now === null ? null : moscowClock(now);
  const week = buildWeek(schedule, filter, clock?.monday ?? null);
  const allPrimes = buildWeek(
    schedule,
    { prime: true, event: false, agl: false },
    null,
  );

  const upcoming = clock
    ? upcomingEvents(week, clock.dayIndex, clock.minutes).slice(0, 4)
    : [];
  const nextPrime = clock
    ? (upcomingEvents(allPrimes, clock.dayIndex, clock.minutes)[0] ?? null)
    : null;
  const dayStates: DayState[] = week.map((day) => ({
    isToday: clock?.dayIndex === day.index,
    currentMinutes: clock?.dayIndex === day.index ? clock.minutes : null,
  }));
  const selectedIndex = pickedDay ?? clock?.dayIndex ?? 0;
  const selectedDay = week[selectedIndex];

  return (
    <div className="@container/sched mx-auto flex w-full max-w-6xl min-w-0 flex-col gap-4 text-sm">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight sm:text-[26px]">
            Расписание
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Неделя боссов и ивентов · время московское
            {clock && ` · сейчас ${formatClock(clock.minutes)}`}
          </p>
        </div>
        <div
          role="group"
          aria-label="Что показывать"
          className="-mx-4 flex gap-1.5 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0"
        >
          {FILTERS.map(({ kind, label, dot }) => (
            <button
              key={kind}
              type="button"
              aria-pressed={filter[kind]}
              onClick={() =>
                setFilter((previous) => ({
                  ...previous,
                  [kind]: !previous[kind],
                }))
              }
              className={cn(
                "inline-flex h-9 shrink-0 cursor-pointer items-center gap-2 rounded-full border px-3 text-[13px] font-medium whitespace-nowrap transition-colors sm:h-8",
                filter[kind]
                  ? "bg-background text-foreground"
                  : "bg-muted/50 text-muted-foreground",
              )}
            >
              <span
                className={cn(
                  "size-2 rounded-full",
                  dot,
                  !filter[kind] && "opacity-0",
                )}
              />
              {label}
            </button>
          ))}
        </div>
      </div>

      {clock && (
        <div className="grid gap-3 @[48rem]/sched:grid-cols-[300px_minmax(0,1fr)]">
          {nextPrime && (
            <section
              aria-label="Ближайший прайм"
              style={eventStyle(nextPrime.name)}
              className="flex items-center justify-between gap-3 rounded-xl border bg-[color-mix(in_srgb,var(--event-color)_8%,transparent)] px-4 py-3 @[48rem]/sched:flex-col @[48rem]/sched:items-start @[48rem]/sched:justify-center @[48rem]/sched:gap-1 dark:bg-[color-mix(in_srgb,var(--event-color-dark)_12%,transparent)]"
            >
              <span className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold text-muted-foreground">
                  Ближайший прайм
                </span>
                <EventName
                  event={nextPrime}
                  className="text-xl leading-tight font-extrabold @[48rem]/sched:text-2xl"
                />
              </span>
              <span className="flex flex-col items-end text-sm @[48rem]/sched:flex-row @[48rem]/sched:items-baseline @[48rem]/sched:gap-1.5">
                <span className="text-lg font-bold tabular-nums @[48rem]/sched:text-sm">
                  {nextPrime.time}
                </span>
                <span className="text-xs text-muted-foreground @[48rem]/sched:text-sm">
                  <span className="hidden @[48rem]/sched:inline">
                    {dayLabel(nextPrime.dayOffset, clock.dayIndex)} ·{" "}
                  </span>
                  {formatCountdown(nextPrime.minutesLeft)}
                </span>
              </span>
            </section>
          )}
          {upcoming.length > 0 && (
            <section
              aria-label="Дальше по расписанию"
              className="hidden flex-col gap-2 rounded-xl border px-3.5 py-3 @[48rem]/sched:flex"
            >
              <span className="text-xs font-semibold text-muted-foreground">
                Дальше
              </span>
              <div className="grid grid-cols-4 gap-2">
                {upcoming.map((event) => (
                  <div
                    key={`${event.key}-${event.dayOffset}`}
                    className="flex min-w-0 flex-col rounded-lg bg-muted/50 px-2.5 py-2"
                  >
                    <span className="text-xs text-muted-foreground tabular-nums">
                      {event.time} ·{" "}
                      {event.dayOffset === 0
                        ? formatCountdown(event.minutesLeft)
                        : dayLabel(event.dayOffset, clock.dayIndex)}
                    </span>
                    <EventName event={event} className="truncate" />
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      )}

      <div className="hidden @[60rem]/sched:block">
        <WeekGrid week={week} dayStates={dayStates} />
      </div>

      <div className="flex flex-col gap-3 @[60rem]/sched:hidden">
        <div
          role="tablist"
          aria-label="День недели"
          className="grid grid-cols-7 gap-1"
        >
          {week.map((day) => {
            const selected = day.index === selectedIndex;
            const today = dayStates[day.index].isToday;
            return (
              <button
                key={day.name}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-label={day.name}
                onClick={() => setPickedDay(day.index)}
                className={cn(
                  "flex h-[50px] cursor-pointer flex-col items-center justify-center rounded-lg border leading-tight transition-colors",
                  selected
                    ? "border-foreground bg-foreground text-background"
                    : today
                      ? "border-green-300 bg-green-100 text-green-800 dark:border-green-500/40 dark:bg-green-500/15 dark:text-green-300"
                      : "bg-background hover:bg-muted",
                )}
              >
                <span className="text-xs font-semibold">{day.short}</span>
                {day.date && (
                  <span className="text-[15px] font-bold">
                    {day.date.getUTCDate()}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <div className="flex items-baseline gap-2 px-0.5">
          <h2 className="text-base font-bold">
            {selectedDay.name}
            {selectedDay.date && `, ${formatDayDate(selectedDay.date)}`}
          </h2>
          <span className="text-[12.5px] text-muted-foreground">
            {eventsCount(selectedDay.events.length)}
          </span>
        </div>
        <DayList
          key={selectedDay.name}
          day={selectedDay}
          state={dayStates[selectedIndex]}
        />
      </div>
    </div>
  );
}
