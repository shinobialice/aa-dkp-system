import { respawnWindow } from "@/shared/config/bossRespawn";
import { formatMoscowHM } from "@/shared/lib/format";
import { cn } from "@/shared/lib/tw-merge";
import { formatMoscowShort } from "../mainPageTime";
import type { RespawnInfo } from "./respawnModel";

type Props = {
  info: Extract<RespawnInfo, { progress: number }>;
  respawnHours: number;
  now: Date;
};

export default function RespawnProgress({ info, respawnHours, now }: Props) {
  const windowStart = (respawnHours / (respawnHours + respawnWindow)) * 100;

  return (
    <div className="space-y-1.5">
      <div className="relative h-2 overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            "absolute inset-y-0 right-0",
            info.kind === "missed"
              ? "bg-red-200 dark:bg-red-500/30"
              : "bg-green-100 dark:bg-green-500/20",
          )}
          style={{ left: `${windowStart}%` }}
        />
        <div
          className={cn(
            "absolute inset-y-0 left-0 rounded-full",
            info.kind === "open" && "bg-green-500",
            info.kind === "waiting" && "bg-zinc-400 dark:bg-zinc-500",
            info.kind === "missed" && "bg-red-300 dark:bg-red-500/60",
          )}
          style={{ width: `${info.progress}%` }}
        />
      </div>
      <div className="flex justify-between gap-2 text-xs text-muted-foreground tabular-nums">
        <span>убит {formatMoscowShort(info.killDate, now)}</span>
        <span>
          окно {formatMoscowShort(info.respawnStart, now)}–
          {formatMoscowHM(info.respawnEnd)}
        </span>
      </div>
    </div>
  );
}
