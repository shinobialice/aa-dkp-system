import type { CSSProperties } from "react";

export type ScheduleMap = Record<string, [string, string][]>;

export type EventKind = "prime" | "event" | "agl";

export type ScheduleEvent = {
  key: string;
  time: string;
  name: string;
  kind: EventKind;
  minutes: number;
};

export type ScheduleDay = {
  name: string;
  short: string;
  index: number;
  date: Date | null;
  events: ScheduleEvent[];
};

export type UpcomingEvent = ScheduleEvent & {
  dayOffset: number;
  minutesLeft: number;
};

export const WEEK_DAYS = [
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
  "Воскресенье",
];

const SHORT_DAYS = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

const HIDDEN_EVENTS = ["Летучий Дельфиец"];

export const EVENT_COLORS: Record<string, { light: string; dark: string }> = {
  Кракен: { light: "#dc2626", dark: "#f87171" },
  Калидис: { light: "#7c3aed", dark: "#a78bfa" },
  Левиафан: { light: "#0e7490", dark: "#22d3ee" },
  Ксанатос: { light: "#c2410c", dark: "#fb923c" },
  Анталлон: { light: "#a16207", dark: "#facc15" },
  Фесаникс: { light: "#0284c7", dark: "#7dd3fc" },
  "Осада замка": { light: "#18181b", dark: "#f4f4f5" },
  "Пепельные равнины": { light: "#57534e", dark: "#d6d3d1" },
  "Великий луг": { light: "#15803d", dark: "#4ade80" },
  "Оборона Ифнира": { light: "#be185d", dark: "#f472b6" },
};

const PRIME_EVENTS = [
  "Кракен",
  "Калидис",
  "Левиафан",
  "Ксанатос",
  "Анталлон",
  "Фесаникс",
  "Осада замка",
];

export const KIND_LABELS: Record<EventKind, string> = {
  prime: "Прайм",
  event: "Ивент",
  agl: "АГЛ",
};

export type KindFilter = Record<EventKind, boolean>;

export function eventKind(name: string): EventKind {
  if (PRIME_EVENTS.includes(name)) return "prime";
  if (EVENT_COLORS[name]) return "event";
  return "agl";
}

function toMinutes(time: string) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
}

const MSK_OFFSET_MS = 3 * 60 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

export function moscowClock(now: number) {
  const msk = new Date(now + MSK_OFFSET_MS);
  const dayIndex = (msk.getUTCDay() + 6) % 7;
  const minutes = msk.getUTCHours() * 60 + msk.getUTCMinutes();
  const monday = new Date(
    Date.UTC(msk.getUTCFullYear(), msk.getUTCMonth(), msk.getUTCDate()) -
      dayIndex * DAY_MS,
  );
  return { dayIndex, minutes, monday };
}

export function formatClock(minutes: number) {
  const hours = String(Math.floor(minutes / 60)).padStart(2, "0");
  return `${hours}:${String(minutes % 60).padStart(2, "0")}`;
}

export function buildWeek(
  schedule: ScheduleMap,
  filter: KindFilter,
  monday: Date | null,
): ScheduleDay[] {
  return WEEK_DAYS.map((name, index) => ({
    name,
    short: SHORT_DAYS[index],
    index,
    date: monday ? new Date(monday.getTime() + index * DAY_MS) : null,
    events: (schedule[name] ?? [])
      .filter(([, eventName]) => !HIDDEN_EVENTS.includes(eventName))
      .map(([time, eventName], position) => ({
        key: `${name}-${time}-${eventName}-${position}`,
        time: time.slice(0, 5),
        name: eventName,
        kind: eventKind(eventName),
        minutes: toMinutes(time),
      }))
      .filter((event) => filter[event.kind])
      .sort((a, b) => a.minutes - b.minutes),
  }));
}

export function upcomingEvents(
  week: ScheduleDay[],
  dayIndex: number,
  minutes: number,
): UpcomingEvent[] {
  const result: UpcomingEvent[] = [];
  for (let offset = 0; offset <= 7; offset++) {
    const day = week[(dayIndex + offset) % 7];
    for (const event of day.events) {
      const minutesLeft = offset * 1440 + event.minutes - minutes;
      if (minutesLeft < 0 || minutesLeft >= 7 * 1440) continue;
      result.push({ ...event, dayOffset: offset, minutesLeft });
    }
  }
  return result.sort((a, b) => a.minutesLeft - b.minutesLeft);
}

export function formatCountdown(minutesLeft: number) {
  if (minutesLeft < 1) return "сейчас";
  if (minutesLeft < 60) return `через ${minutesLeft} мин`;
  const hours = Math.floor(minutesLeft / 60);
  const rest = minutesLeft % 60;
  if (hours < 24) return `через ${hours} ч${rest ? ` ${rest} мин` : ""}`;
  return `через ${Math.floor(hours / 24)} д ${hours % 24} ч`;
}

export function dayLabel(offset: number, dayIndex: number) {
  if (offset === 0) return "сегодня";
  if (offset === 1) return "завтра";
  return WEEK_DAYS[(dayIndex + offset) % 7].toLowerCase();
}

export function formatDayDate(date: Date) {
  return date
    .toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "short",
      timeZone: "UTC",
    })
    .replace(".", "");
}

export function eventStyle(name: string) {
  const colors = EVENT_COLORS[name];
  if (!colors) return undefined;
  return {
    "--event-color": colors.light,
    "--event-color-dark": colors.dark,
  } as CSSProperties;
}

export function eventsCount(n: number) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return `${n} событие`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return `${n} события`;
  }
  return `${n} событий`;
}
