import type { GuildMode } from "@/shared/config/guildStatus";
import { cn } from "@/shared/lib/tw-merge";
import type { PeriodSegment } from "./attendanceChartModel";

type Props = {
  segments: PeriodSegment[];
};

const MODE_COLOR: Record<GuildMode, string> = {
  freeshard: "bg-amber-400 dark:bg-amber-500/80",
  pvp: "bg-red-500 dark:bg-red-500/80",
};

export default function PeriodStrip({ segments }: Props) {
  if (segments.length === 0) return null;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="relative ml-11 h-2 rounded-full bg-border/50">
        {segments.map((segment) => (
          <span
            key={segment.key}
            title={segment.title}
            className={cn(
              "absolute inset-y-0 rounded-full border-x border-card",
              MODE_COLOR[segment.mode],
            )}
            style={{ left: `${segment.left}%`, width: `${segment.width}%` }}
          />
        ))}
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
        {segments.map((segment) => (
          <span key={segment.key} className="flex items-center gap-1.5">
            <span
              className={cn("h-1.5 w-3 rounded-full", MODE_COLOR[segment.mode])}
            />
            {segment.title}
          </span>
        ))}
      </div>
    </div>
  );
}
