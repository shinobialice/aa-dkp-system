import { isBossName } from "@/shared/config/bossRespawn";
import { getMoscowTime } from "@/shared/config/fixedSchedule";
import type { UpcomingEvent } from "@/shared/lib/upcomingEvents";
import { formatDuration } from "../mainPageTime";

const LINEUP_SIZE = 6;
const SECOND_MS = 1000;
const SHORT_NAME = 6;
const MEDIUM_NAME = 10;

export type PosterPlan = {
  main: UpcomingEvent | null;
  current: UpcomingEvent[];
  lineup: UpcomingEvent[];
};

export function planPoster(events: UpcomingEvent[]): PosterPlan {
  const upcoming = events.filter((event) => !event.isNow);
  const main =
    upcoming.find((event) => !isRespawnEvent(event)) ?? upcoming[0] ?? null;
  return {
    main,
    current: events.filter((event) => event.isNow),
    lineup: upcoming.filter((event) => event !== main).slice(0, LINEUP_SIZE),
  };
}

export function isRespawnEvent(event: UpcomingEvent) {
  return isBossName(event.boss);
}

export function secondsUntil(event: UpcomingEvent, nowMs: number) {
  const moscowNow = getMoscowTime(new Date(nowMs)).getTime();
  return Math.max(
    0,
    Math.floor((event.date.getTime() - moscowNow) / SECOND_MS),
  );
}

export function formatCountdown(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  return [hours, minutes, totalSeconds % 60]
    .map((part) => part.toString().padStart(2, "0"))
    .join(":");
}

export function titleSizeClass(name: string) {
  if (name.length <= SHORT_NAME) return "text-[clamp(56px,10vw,104px)]";
  if (name.length <= MEDIUM_NAME) return "text-[clamp(42px,7.5vw,80px)]";
  return "text-[clamp(32px,5.4vw,60px)]";
}

export function dayLabel(date: Date, today: Date) {
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  if (sameDay(date, today)) return "сегодня";
  if (sameDay(date, tomorrow)) return "завтра";
  return date.toLocaleDateString("ru-RU", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function lineupNote(event: UpcomingEvent, today: Date) {
  return isRespawnEvent(event) ? "окно респауна" : dayLabel(event.date, today);
}

export function currentLabel(current: UpcomingEvent[]) {
  return current
    .map((event) => {
      const name = isRespawnEvent(event) ? `окно ${event.boss}` : event.boss;
      return `${name}, ещё ${formatDuration(event.endsInMin ?? 0)}`;
    })
    .join(" · ");
}

function sameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
