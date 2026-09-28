import Image from "next/image";
import type { KillcountStats } from "@/actions/getUserKillcountStats";
import { getKillcountRank } from "@/shared/config/killcountRanks";
import { cn } from "@/shared/lib";

export default function RankProgress({
  stats,
  className,
}: {
  stats: KillcountStats | null;
  className?: string;
}) {
  if (!stats) return null;

  const { current, next, leaderboardPlace } = getKillcountRank(
    stats.kills,
    stats.place,
  );

  const percent = next
    ? Math.min(
        100,
        ((stats.kills - current.minKills) /
          (next.minKills - current.minKills)) *
          100,
      )
    : 100;

  const kills = stats.kills.toLocaleString("ru-RU");

  return (
    <div
      className={cn(
        "w-fit max-w-[340px] space-y-2.5 rounded-lg border bg-card p-3",
        className,
      )}
    >
      <div className="flex items-center gap-2.5">
        <div className="relative shrink-0">
          <Image src={current.icon} alt={current.name} width={64} height={64} />
          {leaderboardPlace && (
            <span className="absolute left-1/2 top-[83%] -translate-x-1/2 -translate-y-1/2 text-[11px] font-bold leading-none text-white [text-shadow:0_0_3px_black,0_0_2px_black]">
              {leaderboardPlace}
            </span>
          )}
        </div>
        <div>
          <div className="text-base font-semibold">{current.name}</div>
          <div className="text-xs text-muted-foreground">
            {stats.isCurrentWar ? "Текущий вар" : "Итог прошлого вара"}
          </div>
        </div>
      </div>
      <div className="space-y-1">
        <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-[width]"
            style={{ width: `${percent}%` }}
          />
        </div>
        <div className="text-xs text-muted-foreground">
          {next ? (
            <>
              {kills} / {next.minKills.toLocaleString("ru-RU")} килов до ранга «
              {next.name}»
            </>
          ) : (
            <>
              {kills} килов — {stats.place} место в гильдии
            </>
          )}
        </div>
      </div>
      <div className="flex gap-4 text-xs">
        <div>
          <div className="text-muted-foreground">Ср. киллов</div>
          <div className="font-semibold">{stats.avgKills}</div>
        </div>
        <div>
          <div className="text-muted-foreground">Ср. хонор</div>
          <div className="font-semibold">{stats.avgHonor}</div>
        </div>
      </div>
    </div>
  );
}
