import type { GuildMode } from "@/shared/config/guildStatus";
import type { OpponentView } from "../opponentsModel";
import { formatDayMonth, formatSpan } from "../warModel";

const SECOND_MS = 1000;
const DAY_S = 86_400;
const HOUR_S = 3600;

export const CLOCK_LABEL: Record<GuildMode, string> = {
  pvp: "на фронте",
  freeshard: "на фришке",
};

export function statusLabel(mode: GuildMode, isLive: boolean) {
  if (mode === "pvp") return isLive ? "Вар идёт" : "Вар завершён";
  return isLive ? "Фришка идёт" : "Фришка завершена";
}

export function statusTone(mode: GuildMode, isLive: boolean) {
  if (!isLive) return "bg-white/15 text-white";
  return mode === "pvp"
    ? "bg-red-500 text-white"
    : "bg-green-500 text-green-950";
}

export function liveClock(fromIso: string, nowMs: number) {
  const total = Math.max(
    0,
    Math.floor((nowMs - new Date(fromIso).getTime()) / SECOND_MS),
  );
  const rest = total % DAY_S;
  const time = [
    Math.floor(rest / HOUR_S),
    Math.floor((rest % HOUR_S) / 60),
    rest % 60,
  ]
    .map((part) => part.toString().padStart(2, "0"))
    .join(":");
  return { days: `${Math.floor(total / DAY_S)} д`, time };
}

export function monogram(name: string) {
  const words = name.trim().split(/\s+/);
  if (words.length > 1) return (words[0][0] + words[1][0]).toUpperCase();
  return name.length <= 3 ? name.toUpperCase() : name.slice(0, 2).toUpperCase();
}

export function foeNote(opponent: OpponentView) {
  const { startedAt, endedAt, status } = opponent;
  if (!startedAt) return null;
  if (!endedAt) return `с ${formatDayMonth(startedAt)}`;
  const span = formatSpan(startedAt, new Date(endedAt).getTime());
  if (status === "ended") {
    return `слились ${formatDayMonth(endedAt)} · воевали ${span}`;
  }
  return `до конца вара · ${span}`;
}
