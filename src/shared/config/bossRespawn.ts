export type BossName = "Марли" | "Морф";

export const bosses: BossName[] = ["Марли", "Морф"];

export const respawnWindow = 1;

export const respawnHoursByBoss: Record<BossName, number> = {
  Марли: 12,
  Морф: 12,
};

export const bossEmoji: Record<BossName, string> = {
  Марли: "🏴‍☠️",
  Морф: "⚓",
};

export const missedAdjectiveByBoss: Record<BossName, string> = {
  Марли: "проёбана",
  Морф: "проёбан",
};

export function getRespawnStart(lastKill: string, respawnHours: number): Date {
  return new Date(new Date(lastKill).getTime() + respawnHours * 60 * 60 * 1000);
}

export function getNextMissedCycleStart(
  respawnStart: Date,
  now: Date,
  respawnHours: number,
): Date {
  const cycleMs = (respawnHours + respawnWindow) * 60 * 60 * 1000;
  let cursor = respawnStart;
  while (now.getTime() > cursor.getTime() + respawnWindow * 60 * 60 * 1000) {
    cursor = new Date(cursor.getTime() + cycleMs);
  }
  return cursor;
}

export type MaintenanceWindow = { startAt: string; endAt: string };

function findAdHocWindow(
  now: Date,
  windows: MaintenanceWindow[],
): MaintenanceWindow | null {
  return (
    windows.find((w) => {
      const start = new Date(w.startAt).getTime();
      const end = new Date(w.endAt).getTime();
      const t = now.getTime();
      return t >= start && t < end;
    }) ?? null
  );
}

function isThursdayMsk(date: Date): boolean {
  return (
    date.toLocaleString("en-US", {
      timeZone: "Europe/Moscow",
      weekday: "short",
    }) === "Thu"
  );
}

function getRecurringWindowBoundsForDay(date: Date): {
  start: Date;
  end: Date;
} {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Moscow",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const get = (type: string) => parts.find((p) => p.type === type)!.value;
  const dateStr = `${get("year")}-${get("month")}-${get("day")}`;

  return {
    start: new Date(`${dateStr}T05:00:00+03:00`),
    end: new Date(`${dateStr}T11:00:00+03:00`),
  };
}

function getRecurringMaintenanceWindow(
  date: Date,
): { start: Date; end: Date } | null {
  if (!isThursdayMsk(date)) return null;
  const { start, end } = getRecurringWindowBoundsForDay(date);
  if (date < start || date >= end) return null;
  return { start, end };
}

export function isMaintenanceWindow(
  now: Date = new Date(),
  adHocWindows: MaintenanceWindow[] = [],
): boolean {
  if (findAdHocWindow(now, adHocWindows)) return true;
  return getRecurringMaintenanceWindow(now) !== null;
}

export function getTodayRecurringMaintenanceWindow(
  now: Date = new Date(),
): { start: Date; end: Date } | null {
  if (!isThursdayMsk(now)) return null;
  return getRecurringWindowBoundsForDay(now);
}

export function getRecurringMaintenanceWindowInDays(
  daysFromNow: number,
): { start: Date; end: Date } | null {
  const date = new Date(Date.now() + daysFromNow * 24 * 60 * 60 * 1000);
  if (!isThursdayMsk(date)) return null;
  return getRecurringWindowBoundsForDay(date);
}

export function getNextRecurringMaintenanceWindow(): {
  start: Date;
  end: Date;
} | null {
  const now = new Date();
  for (let offsetDays = 0; offsetDays <= 7; offsetDays += 1) {
    const window = getRecurringMaintenanceWindowInDays(offsetDays);
    if (window && window.end > now) return window;
  }
  return null;
}

export function maintenanceStartedDuring(
  killTime: Date,
  boundary: Date,
  adHocWindows: MaintenanceWindow[] = [],
): boolean {
  const adHocHit = adHocWindows.some((w) => {
    const start = new Date(w.startAt);
    return start > killTime && start <= boundary;
  });
  if (adHocHit) return true;

  for (const offsetDays of [0, 1]) {
    const day = new Date(killTime.getTime() + offsetDays * 24 * 60 * 60 * 1000);
    if (!isThursdayMsk(day)) continue;
    const { start } = getRecurringWindowBoundsForDay(day);
    if (start > killTime && start <= boundary) return true;
  }
  return false;
}
