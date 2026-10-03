"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import { useClock } from "@/hooks/useClock";
import {
  FACTION_LABEL,
  MODE_ICON,
  MODE_LABEL,
  type GuildFaction,
  type GuildMode,
} from "@/shared/config/guildStatus";
import { cn } from "@/shared/lib/tw-merge";
import { periodTone } from "./periodStyles";
import {
  formatDayMonth,
  formatFullDate,
  formatSpan,
  MINUTE_MS,
  MINUTE_POLL_MS,
} from "./warModel";

const LIVE_LABEL: Record<GuildMode, string> = {
  pvp: "Вар идёт",
  freeshard: "Идёт",
};
const ENDED_LABEL: Record<GuildMode, string> = {
  pvp: "Вар завершён",
  freeshard: "Завершена",
};

type Props = {
  mode: GuildMode;
  server: string;
  faction: GuildFaction;
  startedAt: string | null;
  endedAt?: string | null;
  compact?: boolean;
  aside?: ReactNode;
};

export default function WarHeader({
  mode,
  server,
  faction,
  startedAt,
  endedAt = null,
  compact = false,
  aside,
}: Props) {
  const Heading = compact ? "h2" : "h1";
  const period = periodLabel(startedAt, endedAt);

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div className="flex min-w-0 items-center gap-3 sm:gap-3.5">
        <Image
          src={MODE_ICON[mode]}
          alt=""
          width={58}
          height={58}
          className={cn(
            "shrink-0 object-contain",
            compact ? "size-10" : "size-12 sm:size-14",
          )}
        />
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <Heading
              className={cn(
                "leading-tight font-bold tracking-tight",
                compact ? "text-xl" : "text-2xl",
              )}
            >
              {MODE_LABEL[mode]}
            </Heading>
            <StatusChip mode={mode} startedAt={startedAt} endedAt={endedAt} />
          </div>
          <p className="mt-0.5 text-sm text-muted-foreground">
            {server} · {FACTION_LABEL[faction]}
            {period && ` · ${period}`}
          </p>
        </div>
      </div>
      {aside}
    </div>
  );
}

type StatusChipProps = {
  mode: GuildMode;
  startedAt: string | null;
  endedAt: string | null;
};

function StatusChip({ mode, startedAt, endedAt }: StatusChipProps) {
  const now = useClock(MINUTE_MS, MINUTE_POLL_MS);
  const live = !endedAt;
  const tone = periodTone(mode, live);
  const endMs = endedAt ? new Date(endedAt).getTime() : now;
  const span =
    startedAt && endMs !== null ? formatSpan(startedAt, endMs) : null;

  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1.5 rounded-full border px-2.5 text-xs font-semibold whitespace-nowrap",
        tone.chip,
      )}
    >
      <span className={cn("size-1.5 rounded-full", tone.dot)} />
      {live ? LIVE_LABEL[mode] : ENDED_LABEL[mode]}
      {span && ` · ${span}`}
    </span>
  );
}

function periodLabel(startedAt: string | null, endedAt: string | null) {
  if (!startedAt) return null;
  if (endedAt) {
    return `${formatFullDate(startedAt)} — ${formatFullDate(endedAt)}`;
  }
  return `с ${formatDayMonth(startedAt, true)}`;
}
