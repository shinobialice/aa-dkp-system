import type { GuildMode } from "@/shared/config/guildStatus";

const LIVE_TONE: Record<GuildMode, { chip: string; dot: string }> = {
  pvp: {
    chip: "border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400",
    dot: "bg-red-600",
  },
  freeshard: {
    chip: "border-green-200 bg-green-50 text-green-700 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-400",
    dot: "bg-green-600",
  },
};

const ENDED_TONE = {
  chip: "border-border bg-muted text-muted-foreground",
  dot: "bg-muted-foreground/60",
};

export function periodTone(mode: GuildMode, live: boolean) {
  return live ? LIVE_TONE[mode] : ENDED_TONE;
}
