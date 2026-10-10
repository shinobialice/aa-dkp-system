import { plural } from "@/shared/lib/format";

const MINUTE_MS = 60 * 1000;
const HOUR_MS = 60 * MINUTE_MS;
const GAME_DAY_MS = 24 * HOUR_MS;
const GAME_SPEED = 6;

// Игровые сутки длятся 4 реальных часа. Точка сверки: 3 сентября 2026 в 19:20
// по Москве в игре было 06:00. Если таймеры начнут врать, поправить ее.
const SYNC_REAL_MS = Date.UTC(2026, 8, 3, 16, 20);
const SYNC_GAME_MS = 6 * HOUR_MS;

export type BossSpawn = { at: number; inMinutes: number };

export function gameTimeOfDay(nowMs: number) {
  const gameMs = (nowMs - SYNC_REAL_MS) * GAME_SPEED + SYNC_GAME_MS;
  return ((gameMs % GAME_DAY_MS) + GAME_DAY_MS) % GAME_DAY_MS;
}

export function nextBossSpawn(nowMs: number, gameHour: number): BossSpawn {
  const untilGameMs =
    (gameHour * HOUR_MS - gameTimeOfDay(nowMs) + GAME_DAY_MS) % GAME_DAY_MS ||
    GAME_DAY_MS;
  const untilRealMs = untilGameMs / GAME_SPEED;
  return {
    at: nowMs + untilRealMs,
    inMinutes: Math.ceil(untilRealMs / MINUTE_MS),
  };
}

export function formatCountdown(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (hours === 0) {
    return `${rest} ${plural(rest, "минуту", "минуты", "минут")}`;
  }
  return `${hours} ч ${rest} мин`;
}

export function formatMoscowTime(timeMs: number) {
  return new Date(timeMs).toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Moscow",
  });
}

export function formatGameHour(gameHour: number) {
  return `${String(gameHour).padStart(2, "0")}:00`;
}

export function formatGameTime(nowMs: number) {
  const timeOfDay = gameTimeOfDay(nowMs);
  const hours = Math.floor(timeOfDay / HOUR_MS);
  const minutes = Math.floor((timeOfDay % HOUR_MS) / MINUTE_MS);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}
