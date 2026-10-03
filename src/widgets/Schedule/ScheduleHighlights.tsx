import {
  dayLabel,
  eventStyle,
  formatCountdown,
  type UpcomingEvent,
} from "./scheduleModel";
import { EventName } from "./ScheduleParts";

type Props = {
  dayIndex: number;
  nextPrime: UpcomingEvent | null;
  upcoming: UpcomingEvent[];
};

export default function ScheduleHighlights({
  dayIndex,
  nextPrime,
  upcoming,
}: Props) {
  return (
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
                {dayLabel(nextPrime.dayOffset, dayIndex)} ·{" "}
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
                    : dayLabel(event.dayOffset, dayIndex)}
                </span>
                <EventName event={event} className="truncate" />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
