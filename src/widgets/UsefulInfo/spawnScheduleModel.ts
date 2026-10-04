import {
  getMoscowISOString,
  parseMoscowISOString,
} from "@/utils/getMoscowISOString";

export type MapPoint = [x: number, y: number];

export type MapImage = {
  src: string;
  width: number;
  height: number;
};

export type WeeklySchedule = {
  weekdays: number[];
  time: string;
};

export type SpawnWindow = {
  lastSpawnAt: number | null;
  nextSpawnAt: number;
};

export const BOSS_ICON = "/images/maps/boss-marker.png";
export const HOUR_MS = 3_600_000;
const DAY_MS = 86_400_000;
const MINUTE_MS = 60_000;

export function getSpawnWindow(
  now: number,
  schedule: WeeklySchedule,
): SpawnWindow {
  const spawns = spawnTimesAround(now, schedule);
  const nextSpawnAt = spawns.find((at) => at > now);
  if (nextSpawnAt === undefined) {
    throw new Error("Boss schedule has no spawn within a week");
  }
  const lastSpawnAt = spawns.filter((at) => at <= now).at(-1) ?? null;
  return { lastSpawnAt, nextSpawnAt };
}

export function toMapPercent([x, y]: MapPoint, map: MapImage) {
  return {
    left: `${(x / map.width) * 100}%`,
    top: `${(y / map.height) * 100}%`,
  };
}

export function formatSpawnDate(at: number) {
  const date = new Date(at).toLocaleString("ru-RU", {
    timeZone: "Europe/Moscow",
    weekday: "short",
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${date} МСК`;
}

export function formatDuration(ms: number) {
  const totalMinutes = Math.floor(ms / MINUTE_MS);
  if (totalMinutes < 1) return "меньше минуты";

  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;
  const parts: string[] = [];
  if (days) parts.push(`${days} д`);
  if (hours) parts.push(`${hours} ч`);
  if (minutes) parts.push(`${minutes} мин`);
  return parts.join(" ");
}

function spawnTimesAround(now: number, schedule: WeeklySchedule) {
  const spawns: number[] = [];
  for (let offset = -7; offset <= 7; offset++) {
    const date = getMoscowISOString(new Date(now + offset * DAY_MS)).slice(
      0,
      10,
    );
    const weekday = new Date(`${date}T00:00:00Z`).getUTCDay();
    if (schedule.weekdays.includes(weekday)) {
      spawns.push(parseMoscowISOString(`${date}T${schedule.time}`).getTime());
    }
  }
  return spawns;
}
