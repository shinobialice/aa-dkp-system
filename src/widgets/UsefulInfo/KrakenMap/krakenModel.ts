import {
  getSpawnWindow,
  HOUR_MS,
  type MapImage,
  type MapPoint,
  type WeeklySchedule,
} from "../spawnScheduleModel";

export type KrakenState =
  | { phase: "spawned"; sinceSpawnMs: number }
  | { phase: "waiting"; nextSpawnAt: number };

export const KRAKEN_MAP: MapImage = {
  src: "/images/maps/kraken-spawn-points.webp",
  width: 1080,
  height: 920,
};

export const KRAKEN_SCHEDULE_TEXT = "Пн, Чт, Сб · 19:30 МСК";

export const KRAKEN_SPAWNS: { label: string; point: MapPoint }[] = [
  { label: "Низ", point: [616, 569] },
  { label: "Вверх", point: [464, 351] },
];

const KRAKEN_SCHEDULE: WeeklySchedule = {
  weekdays: [1, 4, 6],
  time: "19:30:00",
};
const RECENT_SPAWN_MS = HOUR_MS;

export function getKrakenState(now: number): KrakenState {
  const { lastSpawnAt, nextSpawnAt } = getSpawnWindow(now, KRAKEN_SCHEDULE);
  if (lastSpawnAt !== null && now - lastSpawnAt < RECENT_SPAWN_MS) {
    return { phase: "spawned", sinceSpawnMs: now - lastSpawnAt };
  }
  return { phase: "waiting", nextSpawnAt };
}
