"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import type { GuildFaction, GuildMode } from "@/actions/guildStatusSettings";
import {
  FACTION_LABEL,
  MODE_ICON,
  MODE_LABEL,
} from "@/shared/config/guildStatus";
import { cn } from "@/shared/lib/tw-merge";
import {
  formatDayMonth,
  formatFullDate,
  formatSpan,
  useMinuteNow,
} from "./warModel";

const LIVE_LABEL: Record<GuildMode, string> = {
  pvp: "Вар идёт",
  freeshard: "Идёт",
};
const ENDED_LABEL: Record<GuildMode, string> = {
  pvp: "Вар завершён",
  freeshard: "Завершена",
};

function StatusChip({
  mode,
  startedAt,
  endedAt,
}: {
  mode: GuildMode;
  startedAt: string | null;
  endedAt: string | null;
}) {
  const now = useMinuteNow();
  const live = !endedAt;
  const endMs = endedAt ? new Date(endedAt).getTime() : now;
  const span =
    startedAt && endMs !== null ? formatSpan(startedAt, endMs) : null;

  return (
    <span
      className={cn(
        "inline-flex h-6 items-center gap-1.5 rounded-full border px-2.5 text-xs font-semibold whitespace-nowrap",
        !live && "border-border bg-muted text-muted-foreground",
        live &&
          mode === "pvp" &&
          "border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/10 dark:text-red-400",
        live &&
          mode === "freeshard" &&
          "border-green-200 bg-green-50 text-green-700 dark:border-green-500/30 dark:bg-green-500/10 dark:text-green-400",
      )}
    >
      <span
        className={cn(
          "size-1.5 rounded-full",
          !live
            ? "bg-muted-foreground/60"
            : mode === "pvp"
              ? "bg-red-600"
              : "bg-green-600",
        )}
      />
      {live ? LIVE_LABEL[mode] : ENDED_LABEL[mode]}
      {span && ` · ${span}`}
    </span>
  );
}

export default function WarHeader({
  mode,
  server,
  faction,
  startedAt,
  endedAt = null,
  compact = false,
  aside,
}: {
  mode: GuildMode;
  server: string;
  faction: GuildFaction;
  startedAt: string | null;
  endedAt?: string | null;
  compact?: boolean;
  aside?: ReactNode;
}) {
  const Heading = compact ? "h2" : "h1";
  const period = !startedAt
    ? null
    : endedAt
      ? `${formatFullDate(startedAt)} — ${formatFullDate(endedAt)}`
      : `с ${formatDayMonth(startedAt, true)}`;

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
                compact ? "text-xl" : "text-2xl sm:text-[26px]",
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
