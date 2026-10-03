import { bosses as respawnBosses } from "@/shared/config/bossRespawn";
import type { UpcomingEvent } from "@/shared/lib/upcomingEvents";
import { formatDuration } from "../mainPageTime";

const RELATIVE_LIMIT_MIN = 6 * 60;

export type EventDayGroup = { label: string; events: UpcomingEvent[] };

export function groupEventsByDay(
  events: UpcomingEvent[],
  today: Date,
): EventDayGroup[] {
  const groups: EventDayGroup[] = [];
  for (const event of events) {
    const label = dayLabel(event.date, today);
    const group = groups.at(-1);
    if (group?.label === label) group.events.push(event);
    else groups.push({ label, events: [event] });
  }
  return groups;
}

export function isRespawnEvent(event: UpcomingEvent) {
  return (respawnBosses as string[]).includes(event.boss);
}

export function relativeTime(event: UpcomingEvent) {
  if (event.isNow) return `ещё ${formatDuration(event.endsInMin ?? 0)}`;
  const minutes = event.startsInMin ?? 0;
  return minutes < RELATIVE_LIMIT_MIN ? `через ${formatDuration(minutes)}` : "";
}

function dayLabel(date: Date, today: Date) {
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  if (dayKey(date) === dayKey(today)) return "Сегодня";
  if (dayKey(date) === dayKey(tomorrow)) return "Завтра";
  const label = date.toLocaleDateString("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  return label.charAt(0).toUpperCase() + label.slice(1);
}

function dayKey(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}
