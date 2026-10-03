import {
  bosses as respawnBosses,
  getRecurringMaintenanceWindowInDays,
  getRespawnStart,
  isMaintenanceWindow,
  maintenanceStartedDuring,
  respawnHoursByBoss,
  respawnWindow,
  type BossName,
  type MaintenanceWindow,
} from "@/shared/config/bossRespawn";
import {
  dayNames,
  defaultDurationMinutes,
  eventDurationMinutes,
  getDateWithTime,
  getMoscowTime,
  schedule,
} from "@/shared/config/fixedSchedule";
import { formatMoscowHM } from "./format";

const MAINTENANCE_EVENT = "Проф. работы";
const DAYS_AHEAD = 7;
const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;

export type UpcomingEvent = {
  boss: string;
  time: string;
  date: Date;
  key: string;
  isNow: boolean;
  startsInMin?: number;
  endsInMin?: number;
};

export type LastKills = Record<BossName, string | null>;

type TimeRange = { start: Date; end: Date };

export function upcomingEvents(
  now: Date,
  lastKills: LastKills,
  windows: MaintenanceWindow[],
): UpcomingEvent[] {
  const msk = getMoscowTime(now);
  const shift = msk.getTime() - now.getTime();
  return [
    ...scheduledEvents(msk, shift, windows),
    ...maintenanceEvents(now, shift, windows),
    ...respawnEvents(now, shift, lastKills, windows),
  ].sort((a, b) => a.date.getTime() - b.date.getTime());
}

function scheduledEvents(
  msk: Date,
  shift: number,
  windows: MaintenanceWindow[],
): UpcomingEvent[] {
  const events: UpcomingEvent[] = [];
  for (let offset = 0; offset < DAYS_AHEAD; offset++) {
    const day = dayNames[(msk.getDay() + offset) % 7];
    for (const [time, boss] of schedule[day] ?? []) {
      const start = getDateWithTime(msk, time, offset);
      const duration = eventDurationMinutes[boss] ?? defaultDurationMinutes;
      const end = new Date(start.getTime() + duration * MINUTE_MS);
      const realStart = new Date(start.getTime() - shift);
      if (msk >= end || isMaintenanceWindow(realStart, windows)) continue;

      const isNow = msk >= start;
      events.push({
        boss,
        time,
        date: start,
        key: `${boss}__${start.getTime()}`,
        isNow,
        startsInMin: Math.floor((start.getTime() - msk.getTime()) / MINUTE_MS),
        endsInMin: isNow ? minutesUntil(end, msk) : undefined,
      });
    }
  }
  return events;
}

// Окна проф. работ — регулярные четверговые на неделю вперёд и все
// внеплановые (включая продления штатного окна). Продление обычно начинается
// ровно в момент конца штатного окна, так что окна склеиваем в одну карточку,
// а не показываем два "Проф. работы" подряд.
function maintenanceEvents(
  now: Date,
  shift: number,
  windows: MaintenanceWindow[],
): UpcomingEvent[] {
  const recurring = Array.from({ length: DAYS_AHEAD }, (_, offset) =>
    getRecurringMaintenanceWindowInDays(offset, now),
  ).filter((range): range is TimeRange => range !== null);
  const adHoc = windows.map((w) => ({
    start: new Date(w.startAt),
    end: new Date(w.endAt),
  }));

  return mergeRanges([...recurring, ...adHoc])
    .filter(({ end }) => now < end)
    .map(({ start, end }) => ({
      boss: MAINTENANCE_EVENT,
      time: `${formatMoscowHM(start)}-${formatMoscowHM(end)}`,
      date: new Date(start.getTime() + shift),
      key: `${MAINTENANCE_EVENT}__${start.getTime()}`,
      ...timing(start, end, now),
    }));
}

function respawnEvents(
  now: Date,
  shift: number,
  lastKills: LastKills,
  windows: MaintenanceWindow[],
): UpcomingEvent[] {
  const events: UpcomingEvent[] = [];
  for (const boss of respawnBosses) {
    const lastKill = lastKills[boss];
    if (!lastKill) continue;
    const start = getRespawnStart(lastKill, respawnHoursByBoss[boss]);
    const end = new Date(start.getTime() + respawnWindow * HOUR_MS);
    if (now >= end) continue;
    // Проф. работы между киллом и концом окна возможного респауна сбрасывают
    // респавн в игре, даже если сам start не попадает в окно — расчётное
    // время недостоверно, событие не показываем.
    if (maintenanceStartedDuring(new Date(lastKill), end, windows)) continue;

    events.push({
      boss,
      time: formatMoscowHM(start),
      date: new Date(start.getTime() + shift),
      key: `${boss}__${start.getTime()}`,
      ...timing(start, end, now),
    });
  }
  return events;
}

function mergeRanges(ranges: TimeRange[]): TimeRange[] {
  const sorted = [...ranges].sort(
    (a, b) => a.start.getTime() - b.start.getTime(),
  );
  const merged: TimeRange[] = [];
  for (const range of sorted) {
    const last = merged.at(-1);
    if (last && range.start <= last.end) {
      if (range.end > last.end) last.end = range.end;
    } else {
      merged.push({ ...range });
    }
  }
  return merged;
}

function timing(start: Date, end: Date, now: Date) {
  const isNow = now >= start && now < end;
  return {
    isNow,
    startsInMin: minutesUntil(start, now),
    endsInMin: isNow ? minutesUntil(end, now) : undefined,
  };
}

function minutesUntil(moment: Date, now: Date) {
  return Math.ceil((moment.getTime() - now.getTime()) / MINUTE_MS);
}
