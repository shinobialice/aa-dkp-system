"use client";
import Image from "next/image";
import type { KillcountStats } from "@/actions/getUserKillcountStats";
import { getKillcountRank } from "@/shared/config/killcountRanks";
import { cn } from "@/shared/lib/tw-merge";

type Activity = {
  aglPercent: number;
  primePercent: number;
  totalPercent: number;
  dkp: number;
  totalPointsAvailable: number;
};

const MONTH_SHORT = new Date().toLocaleDateString("ru-RU", { month: "long" });

function formatPoints(value: number): string {
  return Number(value.toFixed(2)).toLocaleString("ru-RU");
}

function attendanceTone(percent: number) {
  if (percent >= 80)
    return { text: "text-green-700 dark:text-green-400", bar: "bg-green-600" };
  if (percent >= 50)
    return { text: "text-amber-700 dark:text-amber-400", bar: "bg-amber-500" };
  return { text: "text-red-700 dark:text-red-400", bar: "bg-red-500" };
}

function Bar({ percent, className }: { percent: number; className: string }) {
  return (
    <span className="relative block h-1.5 overflow-hidden rounded-full bg-muted">
      <span
        className={cn("absolute inset-y-0 left-0 rounded-full", className)}
        style={{ width: `${Math.max(0, Math.min(100, percent))}%` }}
      />
    </span>
  );
}

function Tile({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1.5 rounded-xl border bg-card px-3.5 py-3 sm:px-4 sm:py-3.5">
      <span className="truncate text-xs font-medium text-muted-foreground sm:text-[13px]">
        {label}
      </span>
      {children}
    </div>
  );
}

export default function ProfileStats({
  activity,
  salary,
  killcountStats,
  tenureBonus,
  onOpenSalary,
}: {
  activity: Activity;
  salary: number | null;
  killcountStats: KillcountStats | null;
  tenureBonus: number;
  onOpenSalary: () => void;
}) {
  const total = Math.round(activity.totalPercent);
  const tone = attendanceTone(activity.totalPercent);
  const pointsPercent = activity.totalPointsAvailable
    ? (activity.dkp / activity.totalPointsAvailable) * 100
    : 0;
  const rank = killcountStats
    ? getKillcountRank(killcountStats.kills, killcountStats.place)
    : null;
  const rankPercent =
    rank && killcountStats
      ? rank.next
        ? ((killcountStats.kills - rank.current.minKills) /
            (rank.next.minKills - rank.current.minKills)) *
          100
        : 100
      : 0;

  return (
    <div
      className={cn(
        "grid grid-cols-2 gap-2 sm:gap-3",
        rank ? "lg:grid-cols-4" : "lg:grid-cols-3",
      )}
    >
      <Tile label={`Посещаемость · ${MONTH_SHORT}`}>
        <span
          className={cn(
            "text-[22px] leading-tight font-bold tabular-nums sm:text-[26px]",
            tone.text,
          )}
        >
          {total}%
        </span>
        <Bar percent={activity.totalPercent} className={tone.bar} />
        <span className="text-xs text-muted-foreground">
          прайм {Math.round(activity.primePercent)}% · АГЛ{" "}
          {Math.round(activity.aglPercent)}%
        </span>
      </Tile>

      <Tile label={`Баллы · ${MONTH_SHORT}`}>
        <span className="text-[22px] leading-tight font-bold tabular-nums sm:text-[26px]">
          {formatPoints(activity.dkp)}{" "}
          <span className="text-sm font-medium text-muted-foreground sm:text-base">
            / {formatPoints(activity.totalPointsAvailable)}
          </span>
        </span>
        <Bar percent={pointsPercent} className="bg-muted-foreground/50" />
        <span className="text-xs text-muted-foreground">
          из максимально возможных за месяц
        </span>
      </Tile>

      <Tile label={`Зарплата · ${MONTH_SHORT}`}>
        <span className="flex items-center gap-1.5 text-[22px] leading-tight font-bold tabular-nums sm:text-[26px]">
          <Image
            src="https://archeagecodex.com/items/gold.png"
            alt=""
            width={18}
            height={18}
          />
          {salary != null ? salary.toLocaleString("ru-RU") : "—"}
        </span>
        <span className="text-xs text-muted-foreground">
          {salary != null ? "по последнему расчёту" : "ещё не рассчитана"}
        </span>
        <button
          type="button"
          onClick={onOpenSalary}
          className="mt-auto cursor-pointer self-start text-xs font-medium text-green-700 hover:underline dark:text-green-400"
        >
          стаж +{tenureBonus}%
          <span className="max-sm:hidden"> · подробнее</span> →
        </button>
      </Tile>

      {rank && killcountStats ? (
        <Tile
          label={
            killcountStats.isCurrentWar
              ? "Киллкаунт · текущий вар"
              : "Киллкаунт · прошлый вар"
          }
        >
          <div className="flex items-center gap-2.5">
            <div className="relative shrink-0">
              <Image
                src={rank.current.icon}
                alt=""
                width={44}
                height={44}
                className="size-9 sm:size-11"
              />
              {rank.leaderboardPlace && (
                <span className="absolute top-[83%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10px] leading-none font-bold text-white [text-shadow:0_0_3px_black,0_0_2px_black]">
                  {rank.leaderboardPlace}
                </span>
              )}
            </div>
            <div className="min-w-0">
              <div className="truncate font-bold sm:text-lg">
                {rank.current.name}
              </div>
              <div className="truncate text-xs text-muted-foreground tabular-nums">
                {rank.next
                  ? `${killcountStats.kills.toLocaleString("ru-RU")} / ${rank.next.minKills.toLocaleString("ru-RU")} до «${rank.next.name}»`
                  : `${killcountStats.kills.toLocaleString("ru-RU")} · ${killcountStats.place} место`}
              </div>
            </div>
          </div>
          <Bar percent={rankPercent} className="bg-red-500/80" />
          <span className="text-xs text-muted-foreground">
            в среднем {killcountStats.avgKills} киллов и{" "}
            {killcountStats.avgHonor.toLocaleString("ru-RU")} хонора
          </span>
        </Tile>
      ) : null}
    </div>
  );
}
