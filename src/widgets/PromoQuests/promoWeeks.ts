import type { PromoQuest, PromoQuestEvent } from "@/shared/config/promoQuests";
import { cn } from "@/shared/lib/tw-merge";
import {
  formatDay,
  keyToTime,
  moscowTodayKey,
  timeToKey,
} from "@/widgets/Attendance/attendanceModel";

export const WEEK_DAY_NAMES = ["Чт", "Пт", "Сб", "Вс", "Пн", "Вт", "Ср"];

const DAY_MS = 24 * 60 * 60 * 1000;
const WEEK_MS = 7 * DAY_MS;
const THURSDAY = 4;

export type PromoWeek = {
  number: number;
  start: string;
  goal: number;
  quests: PromoQuest[];
};

export type PromoDay = { index: number; key: string; name: string };

// Недели ивентов в игре сменяются по четвергам, поэтому первая неделя —
// та, на которую пришелся старт ивента.
export function promoStartKey(startsAt: string) {
  const startTime = keyToTime(moscowTodayKey(Date.parse(startsAt)));
  const sinceThursday = (new Date(startTime).getUTCDay() - THURSDAY + 7) % 7;
  return timeToKey(startTime - sinceThursday * DAY_MS);
}

export function promoWeeks(
  event: PromoQuestEvent,
  startKey: string,
): PromoWeek[] {
  return event.weeks.map((quests, index) => ({
    number: index + 1,
    start: timeToKey(keyToTime(startKey) + index * WEEK_MS),
    goal: event.weeklyGoal,
    quests,
  }));
}

export function findPromoWeek(weeks: PromoWeek[], weekStart: string) {
  return weeks.find((week) => week.start === weekStart) ?? null;
}

export function currentPromoWeek(weeks: PromoWeek[], todayKey: string) {
  const sinceStart = keyToTime(todayKey) - keyToTime(weeks[0].start);
  const index = Math.floor(sinceStart / WEEK_MS);
  return weeks[Math.min(Math.max(index, 0), weeks.length - 1)];
}

export function runningWeekNumber(weeks: PromoWeek[], todayKey: string) {
  const week = currentPromoWeek(weeks, todayKey);
  return dayIndexOf(week.start, todayKey) === null ? null : week.number;
}

export function promoStatus(weeks: PromoWeek[], todayKey: string) {
  const first = weeks[0];
  const last = weeks[weeks.length - 1];
  const end = weekDays(last.start)[6].key;
  const dateOptions = { day: "numeric", month: "long" } as const;
  if (todayKey < first.start) {
    return `Начнется ${formatDay(first.start, dateOptions)}`;
  }
  if (todayKey > end) return `Закончился ${formatDay(end, dateOptions)}`;
  const week = currentPromoWeek(weeks, todayKey);
  return `Идет неделя ${week.number} из ${weeks.length}`;
}

export function weekDays(weekStart: string): PromoDay[] {
  const start = keyToTime(weekStart);
  return WEEK_DAY_NAMES.map((name, index) => ({
    index,
    key: timeToKey(start + index * DAY_MS),
    name,
  }));
}

export function dayIndexOf(weekStart: string, dayKey: string) {
  const index = Math.round((keyToTime(dayKey) - keyToTime(weekStart)) / DAY_MS);
  return index >= 0 && index < 7 ? index : null;
}

export function weekDatesLabel(weekStart: string) {
  const days = weekDays(weekStart);
  const first = formatDay(days[0].key, { day: "numeric", month: "short" });
  const last = formatDay(days[6].key, { day: "numeric", month: "short" });
  return `${first} – ${last}`;
}

export function formatDayNumber(dayKey: string) {
  return formatDay(dayKey, { day: "numeric", month: "short" });
}

export function dayCellClass(
  dayIndex: number,
  todayIndex: number | null,
  mobileDay: number,
) {
  return cn(
    dayIndex === todayIndex && "bg-primary/5",
    dayIndex !== mobileDay && "hidden sm:table-cell",
  );
}
