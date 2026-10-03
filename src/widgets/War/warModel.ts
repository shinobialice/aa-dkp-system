import type { GuildPvpStats } from "@/actions/guildPvpStats";
import type { PeriodAttendanceResult } from "@/actions/warAttendance";
import {
  getKillcountRank,
  type KillcountRank,
} from "@/shared/config/killcountRanks";
import { formatNumber } from "@/shared/lib/format";

const DAY_MS = 86_400_000;
export const MINUTE_MS = 60_000;
export const MINUTE_POLL_MS = 10_000;

export const SCROLL_LIST = "overflow-y-auto [scrollbar-width:thin]";
const MOSCOW = "Europe/Moscow";

export function formatDecimal(value: number): string {
  return value.toLocaleString("ru-RU", { maximumFractionDigits: 1 });
}

export function formatShare(part: number, total: number): string {
  if (total <= 0) return "0%";
  const percent = (part / total) * 100;
  return `${percent < 1 ? formatDecimal(percent) : Math.round(percent)}%`;
}

function diffMonthsDays(fromMs: number, toMs: number) {
  const from = new Date(fromMs);
  const to = new Date(toMs);
  let months =
    (to.getFullYear() - from.getFullYear()) * 12 +
    (to.getMonth() - from.getMonth());
  if (to.getDate() < from.getDate()) months -= 1;
  months = Math.max(0, months);
  const monthsLater = new Date(from);
  monthsLater.setMonth(monthsLater.getMonth() + months);
  return {
    months,
    restMs: Math.max(0, to.getTime() - monthsLater.getTime()),
  };
}

export function formatSpan(fromIso: string, toMs: number): string {
  const fromMs = new Date(fromIso).getTime();
  const ms = Math.max(0, toMs - fromMs);
  const minutes = Math.floor(ms / MINUTE_MS);
  if (minutes < 60) return `${minutes} мин`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours} ч ${String(minutes % 60).padStart(2, "0")} мин`;
  }

  const { months, restMs } = diffMonthsDays(fromMs, toMs);
  if (months === 0) {
    const days = Math.floor(ms / DAY_MS);
    const restHours = Math.floor((ms % DAY_MS) / 3_600_000);
    return restHours ? `${days} д ${restHours} ч` : `${days} д`;
  }
  const days = Math.floor(restMs / DAY_MS);
  return days ? `${months} мес. ${days} д` : `${months} мес.`;
}

export function formatDayMonth(iso: string, withYear = false): string {
  return new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    ...(withYear && { year: "numeric" }),
    timeZone: MOSCOW,
  })
    .format(new Date(iso))
    .replace(/s?г.$/, "");
}

export function formatShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    timeZone: MOSCOW,
  });
}

export function formatFullDate(iso: string): string {
  return new Date(iso).toLocaleDateString("ru-RU", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: MOSCOW,
  });
}

function moscowYear(iso: string): string {
  return new Intl.DateTimeFormat("ru-RU", {
    year: "numeric",
    timeZone: MOSCOW,
  }).format(new Date(iso));
}

export function formatStartDate(iso: string): string {
  return formatDayMonth(iso, true);
}

export function formatDateRange(startIso: string, endIso: string): string {
  const sameYear = moscowYear(startIso) === moscowYear(endIso);
  return `с ${formatDayMonth(startIso, !sameYear)} по ${formatStartDate(endIso)}`;
}

export function perDayHint(
  value: number,
  startIso: string | null,
  endMs: number,
): string | null {
  if (!startIso) return null;
  const days = (endMs - new Date(startIso).getTime()) / DAY_MS;
  if (days < 1) return null;
  const perDay = value / days;
  return `≈ ${perDay < 10 ? formatDecimal(perDay) : formatNumber(perDay, 0)} в день`;
}

export type FighterSort = "kills" | "honor" | "raids";

export type Fighter = {
  userId: number;
  name: string;
  avatarUrl: string | null;
  userClass: string | null;
  kills: number | null;
  honor: number | null;
  raids: number | null;
  rank: KillcountRank | null;
};

export function buildFighters(
  attendance: PeriodAttendanceResult,
  stats: GuildPvpStats | null,
): Fighter[] {
  const byId = new Map<number, Fighter>();
  (stats?.players ?? []).forEach((player, index) => {
    byId.set(player.userId, {
      userId: player.userId,
      name: player.userName,
      avatarUrl: player.avatarUrl,
      userClass: player.userClass,
      kills: player.kills,
      honor: player.honor,
      raids: null,
      rank: getKillcountRank(player.kills, index + 1).current,
    });
  });
  attendance.top.forEach((entry) => {
    const existing = byId.get(entry.userId);
    if (existing) {
      existing.raids = entry.raidsAttended;
      return;
    }
    byId.set(entry.userId, {
      userId: entry.userId,
      name: entry.username,
      avatarUrl: entry.avatarUrl,
      userClass: entry.userClass,
      kills: null,
      honor: null,
      raids: entry.raidsAttended,
      rank: null,
    });
  });
  return Array.from(byId.values());
}

export function sortFighters(
  fighters: Fighter[],
  sort: FighterSort,
): Fighter[] {
  return [...fighters].sort((a, b) => {
    const diff = (b[sort] ?? -1) - (a[sort] ?? -1);
    return diff || a.name.localeCompare(b.name, "ru");
  });
}

export type TurnoutBucket = {
  key: "steady" | "partial" | "rare";
  label: string;
  range: string;
  count: number;
};

export function buildTurnout(attendance: PeriodAttendanceResult) {
  const total = attendance.totalRaidsInPeriod;
  const buckets: TurnoutBucket[] = [
    {
      key: "steady",
      label: "Стабильно",
      range: "80% рейдов и больше",
      count: 0,
    },
    { key: "partial", label: "Частично", range: "50–79%", count: 0 },
    { key: "rare", label: "Редко", range: "меньше 50%", count: 0 },
  ];
  let sum = 0;
  attendance.top.forEach((entry) => {
    sum += entry.raidsAttended;
    const share = total ? entry.raidsAttended / total : 0;
    buckets[turnoutBucketIndex(share)].count += 1;
  });
  const average = attendance.top.length ? sum / attendance.top.length : 0;
  return {
    buckets,
    average,
    averagePercent: total ? Math.round((average / total) * 100) : 0,
  };
}

function turnoutBucketIndex(share: number) {
  if (share >= 0.8) return 0;
  if (share >= 0.5) return 1;
  return 2;
}
