import {
  getMoscowISOString,
  parseMoscowISOString,
} from "@/utils/getMoscowISOString";

type Point = [x: number, y: number];

type Segment = {
  start: Point;
  end: Point;
  length: number;
};

export type RoutePosition = {
  x: number;
  y: number;
  lap: number;
  lapPercent: number;
};

export type LeviathanState =
  | { phase: "swimming"; elapsedMs: number; position: RoutePosition }
  | { phase: "waiting"; nextSpawnAt: number };

export const LEVIATHAN_MAP = {
  src: "/images/maps/leviathan-route.webp",
  width: 1200,
  height: 969,
};

export const LEVIATHAN_SCHEDULE_TEXT = "Вт, Чт, Вс · 20:30 МСК";

// The route starts where the boss spawns at 20:30 and keeps this direction.
export const ROUTE: Point[] = [
  [535, 367],
  [665, 341],
  [737, 364],
  [758, 386],
  [752, 427],
  [526, 593],
  [518, 631],
  [538, 669],
  [572, 681],
  [641, 634],
  [808, 603],
  [847, 555],
  [836, 406],
  [808, 380],
  [775, 368],
  [596, 473],
  [536, 453],
  [516, 390],
];

const SPAWN_WEEKDAYS = [0, 2, 4];
const SPAWN_TIME = "20:30:00";
const DAY_MS = 86_400_000;
const HOUR_MS = 3_600_000;
const MINUTE_MS = 60_000;
const SPEED_KMH = 66.7;
const LAP_KM = 26.8;
const LAP_MS = (LAP_KM / SPEED_KMH) * HOUR_MS;
const FORECAST_WINDOW_MS = 2 * HOUR_MS;

const SEGMENTS: Segment[] = ROUTE.map((start, index) => {
  const end = ROUTE[(index + 1) % ROUTE.length];
  return {
    start,
    end,
    length: Math.hypot(end[0] - start[0], end[1] - start[1]),
  };
});

const ROUTE_LENGTH = SEGMENTS.reduce((sum, segment) => sum + segment.length, 0);

export function getLeviathanState(now: number): LeviathanState {
  const spawns = spawnTimesAround(now);
  const lastSpawnAt = spawns.filter((at) => at <= now).at(-1);
  if (lastSpawnAt !== undefined && now - lastSpawnAt < FORECAST_WINDOW_MS) {
    const elapsedMs = now - lastSpawnAt;
    return {
      phase: "swimming",
      elapsedMs,
      position: routePosition(elapsedMs),
    };
  }

  const nextSpawnAt = spawns.find((at) => at > now);
  if (nextSpawnAt === undefined) {
    throw new Error("Leviathan schedule has no spawn within a week");
  }
  return { phase: "waiting", nextSpawnAt };
}

export function toMapPercent([x, y]: Point) {
  return {
    left: `${(x / LEVIATHAN_MAP.width) * 100}%`,
    top: `${(y / LEVIATHAN_MAP.height) * 100}%`,
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

function spawnTimesAround(now: number) {
  const spawns: number[] = [];
  for (let offset = -7; offset <= 7; offset++) {
    const date = getMoscowISOString(new Date(now + offset * DAY_MS)).slice(
      0,
      10,
    );
    const weekday = new Date(`${date}T00:00:00Z`).getUTCDay();
    if (SPAWN_WEEKDAYS.includes(weekday)) {
      spawns.push(parseMoscowISOString(`${date}T${SPAWN_TIME}`).getTime());
    }
  }
  return spawns;
}

function routePosition(elapsedMs: number): RoutePosition {
  const laps = elapsedMs / LAP_MS;
  const lapFraction = laps % 1;
  let distance = lapFraction * ROUTE_LENGTH;
  let segment = SEGMENTS[0];
  for (segment of SEGMENTS) {
    if (distance <= segment.length) break;
    distance -= segment.length;
  }

  const t = Math.min(1, distance / segment.length);
  return {
    x: segment.start[0] + (segment.end[0] - segment.start[0]) * t,
    y: segment.start[1] + (segment.end[1] - segment.start[1]) * t,
    lap: Math.floor(laps) + 1,
    lapPercent: Math.floor(lapFraction * 100),
  };
}
