"use client";

import { useState } from "react";
import { cn } from "@/shared/lib/tw-merge";
import { useClock } from "@/hooks/useClock";
import { MINUTE_MS, MINUTE_POLL_MS } from "@/widgets/War/warModel";
import { type DayState } from "./ScheduleParts";
import { DayList } from "./DayList";
import { WeekGrid } from "./WeekGrid";
import KindFilters from "./KindFilters";
import ScheduleHighlights from "./ScheduleHighlights";
import {
  buildWeek,
  eventsCount,
  formatClock,
  formatDayDate,
  moscowClock,
  upcomingEvents,
  type KindFilter,
  type ScheduleMap,
} from "./scheduleModel";

export default function ScheduleClient({
  schedule,
}: {
  schedule: ScheduleMap;
}) {
  const now = useClock(MINUTE_MS, MINUTE_POLL_MS);
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
          <h1 className="text-2xl font-bold tracking-tight">Расписание</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Неделя боссов и ивентов · время московское
            {clock && ` · сейчас ${formatClock(clock.minutes)}`}
          </p>
        </div>
        <KindFilters
          filter={filter}
          onToggle={(kind) =>
            setFilter((previous) => ({ ...previous, [kind]: !previous[kind] }))
          }
        />
      </div>

      {clock && (
        <ScheduleHighlights
          dayIndex={clock.dayIndex}
          nextPrime={nextPrime}
          upcoming={upcoming}
        />
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
                  "flex h-12.5 cursor-pointer flex-col items-center justify-center rounded-lg border leading-tight transition-colors",
                  dayTone(selected, today),
                )}
              >
                <span className="text-xs font-semibold">{day.short}</span>
                {day.date && (
                  <span className="text-base font-bold">
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
          <span className="text-xs text-muted-foreground">
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

function dayTone(selected: boolean, today: boolean) {
  if (selected) return "border-foreground bg-foreground text-background";
  if (today) {
    return "border-green-300 bg-green-100 text-green-800 dark:border-green-500/40 dark:bg-green-500/15 dark:text-green-300";
  }
  return "bg-background hover:bg-muted";
}
