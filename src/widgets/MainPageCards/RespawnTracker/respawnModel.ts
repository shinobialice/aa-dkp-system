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

type StatusStyle = {
  label: string;
  text: string;
  big: string;
  accent: string;
  fill: string;
  soft: string;
};

const IDLE_STYLE = {
  text: "text-muted-foreground",
  big: "text-muted-foreground",
  accent: "border-l-muted-foreground/40",
  fill: "bg-muted-foreground",
  soft: "from-transparent",
};

export const STATUS_STYLES: Record<RespawnKind, StatusStyle> = {
  waiting: {
    label: "Ожидание",
    text: "text-amber-600 dark:text-amber-400",
    big: "",
    accent: "border-l-amber-500",
    fill: "bg-amber-500",
    soft: "from-amber-500/10",
  },
  open: {
    label: "Возможен респаун",
    text: "text-green-700 dark:text-green-400",
    big: "text-green-700 dark:text-green-400",
    accent: "border-l-green-500",
    fill: "bg-green-500",
    soft: "from-green-500/12",
  },
  missed: {
    label: "Проёбано",
    text: "text-red-700 dark:text-red-400",
    big: "text-red-700 dark:text-red-400",
    accent: "border-l-red-500",
    fill: "bg-red-500",
    soft: "from-red-500/12",
  },
  maintenance: { label: "Проф. работы", ...IDLE_STYLE },
  none: { label: "Нет данных", ...IDLE_STYLE },
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

export function hpCells(
  info: Extract<RespawnInfo, { progress: number }>,
  respawnHours: number,
  now: Date,
) {
  const total = respawnHours + respawnWindow;
  const hoursDone =
    info.kind === "missed"
      ? total
      : (now.getTime() - info.killDate.getTime()) / HOUR_MS;
  return Array.from({ length: total }, (_, index) => ({
    fill: Math.min(1, Math.max(0, hoursDone - index)),
    isWindow: index >= respawnHours,
  }));
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
