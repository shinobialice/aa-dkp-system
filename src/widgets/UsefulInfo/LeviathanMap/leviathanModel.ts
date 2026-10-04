import {
  getSpawnWindow,
  HOUR_MS,
  type MapImage,
  type MapPoint,
  type WeeklySchedule,
} from "../spawnScheduleModel";

type Segment = {
  start: MapPoint;
  end: MapPoint;
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

export const LEVIATHAN_MAP: MapImage = {
  src: "/images/maps/leviathan-route.webp",
  width: 1200,
  height: 969,
};

export const LEVIATHAN_SCHEDULE_TEXT = "Вт, Чт, Вс · 20:30 МСК";

// The route starts where the boss spawns at 20:30 and keeps this direction.
export const ROUTE: MapPoint[] = [
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

const LEVIATHAN_SCHEDULE: WeeklySchedule = {
  weekdays: [0, 2, 4],
  time: "20:30:00",
};
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
  const { lastSpawnAt, nextSpawnAt } = getSpawnWindow(now, LEVIATHAN_SCHEDULE);
  if (lastSpawnAt !== null && now - lastSpawnAt < FORECAST_WINDOW_MS) {
    const elapsedMs = now - lastSpawnAt;
    return {
      phase: "swimming",
      elapsedMs,
      position: routePosition(elapsedMs),
    };
  }
  return { phase: "waiting", nextSpawnAt };
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
