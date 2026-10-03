import {
  REGISTER_COOLDOWN_SECONDS,
  getNextMissedCycleStart,
  getRespawnStart,
  isMaintenanceWindow,
  maintenanceStartedDuring,
  respawnWindow,
  type MaintenanceWindow,
} from "@/shared/config/bossRespawn";
import { formatMoscowHM } from "@/shared/lib/format";
import { formatDuration, formatMoscowShort } from "../mainPageTime";

const HOUR_MS = 60 * 60 * 1000;
const MINUTE_MS = 60 * 1000;

type RespawnTimeline = {
  killDate: Date;
  respawnStart: Date;
  respawnEnd: Date;
  progress: number;
};

export type RespawnInfo =
  | { kind: "maintenance" | "none" }
  | ({ kind: "waiting" | "open" } & RespawnTimeline)
  | ({ kind: "missed"; nextCycle: Date } & RespawnTimeline);

export type RespawnKind = RespawnInfo["kind"];

export const STATUS_STYLES: Record<
  RespawnKind,
  { label: string; chip: string; dot: string; big: string }
> = {
  waiting: {
    label: "Ожидание",
    chip: "bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
    dot: "bg-amber-500",
    big: "",
  },
  open: {
    label: "Возможен респаун",
    chip: "bg-green-50 text-green-700 dark:bg-green-500/15 dark:text-green-300",
    dot: "bg-green-500 animate-pulse",
    big: "text-green-700 dark:text-green-400",
  },
  missed: {
    label: "Проёбано",
    chip: "bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-300",
    dot: "bg-red-500",
    big: "text-red-700 dark:text-red-400",
  },
  maintenance: {
    label: "Проф. работы",
    chip: "bg-muted text-muted-foreground",
    dot: "bg-zinc-400",
    big: "text-muted-foreground",
  },
  none: {
    label: "Нет данных",
    chip: "bg-muted text-muted-foreground",
    dot: "bg-zinc-400",
    big: "text-muted-foreground",
  },
};

export function respawnInfo(
  lastKill: string | null,
  respawnHours: number,
  now: Date,
  windows: MaintenanceWindow[],
): RespawnInfo {
  if (isMaintenanceWindow(now, windows)) return { kind: "maintenance" };
  if (!lastKill) return { kind: "none" };

  const killDate = new Date(lastKill);
  const respawnStart = getRespawnStart(lastKill, respawnHours);
  const respawnEnd = new Date(respawnStart.getTime() + respawnWindow * HOUR_MS);
  if (maintenanceStartedDuring(killDate, respawnEnd, windows)) {
    return { kind: "maintenance" };
  }

  const cycleMs = (respawnHours + respawnWindow) * HOUR_MS;
  const elapsed = ((now.getTime() - killDate.getTime()) / cycleMs) * 100;
  const timeline = {
    killDate,
    respawnStart,
    respawnEnd,
    progress: Math.min(100, Math.max(0, elapsed)),
  };

  if (now < respawnStart) return { kind: "waiting", ...timeline };
  if (now <= respawnEnd) return { kind: "open", ...timeline };

  const nextCycle = getNextMissedCycleStart(respawnStart, now, respawnHours);
  const cascadeEnd = new Date(nextCycle.getTime() + respawnWindow * HOUR_MS);
  if (maintenanceStartedDuring(respawnEnd, cascadeEnd, windows)) {
    return { kind: "maintenance" };
  }
  return { kind: "missed", nextCycle, ...timeline, progress: 100 };
}

export function describeRespawn(info: RespawnInfo, now: Date) {
  switch (info.kind) {
    case "waiting":
      return {
        big: `через ${formatDuration(minutesUntil(info.respawnStart, now))}`,
        sub: `Респаун в окне ${formatMoscowShort(info.respawnStart, now)}–${formatMoscowHM(info.respawnEnd)}`,
      };
    case "open":
      return {
        big: "Окно открыто",
        sub: `ещё ${formatDuration(minutesUntil(info.respawnEnd, now))} — до конца окна`,
      };
    case "missed":
      return { big: "Окно пропущено", sub: missedHint(info.nextCycle, now) };
    case "maintenance":
      return {
        big: "Таймер на паузе",
        sub: "Идут проф. работы — отметьте убийство после них",
      };
    default:
      return { big: "Нет данных", sub: "Отметьте, когда босса убьют" };
  }
}

export function respawnCardView(
  state: { lastKill: string | null; updatedAt: string | null } | null,
  respawnHours: number,
  now: Date | null,
  windows: MaintenanceWindow[],
) {
  if (!state || !now) return null;
  const info = respawnInfo(state.lastKill, respawnHours, now, windows);
  return {
    info,
    text: describeRespawn(info, now),
    cooldown: cooldownSecondsLeft(state.updatedAt, now),
  };
}

export function cooldownSecondsLeft(updatedAt: string | null, now: Date) {
  if (!updatedAt) return 0;
  const elapsedMs = now.getTime() - new Date(updatedAt).getTime();
  return Math.max(
    0,
    Math.ceil((REGISTER_COOLDOWN_SECONDS * 1000 - elapsedMs) / 1000),
  );
}

function missedHint(nextCycle: Date, now: Date) {
  if (nextCycle > now) {
    return `Следующий цикл примерно в ${formatMoscowShort(nextCycle, now)}`;
  }
  const windowEnd = new Date(nextCycle.getTime() + respawnWindow * HOUR_MS);
  return `Новое окно примерно до ${formatMoscowHM(windowEnd)}`;
}

function minutesUntil(moment: Date, now: Date) {
  return Math.ceil((moment.getTime() - now.getTime()) / MINUTE_MS);
}
