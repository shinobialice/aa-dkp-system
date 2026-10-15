"use client";

import { useState } from "react";
import type { BossRespawnState } from "@/hooks/useBossRespawnStatus";
import { bossImages } from "@/shared/config/bossImages";
import {
  respawnHoursByBoss,
  type BossName,
  type KillAction,
  type MaintenanceWindow,
} from "@/shared/config/bossRespawn";
import { cn } from "@/shared/lib/tw-merge";
import { Skeleton } from "@/shared/ui";
import ShieldImage from "@/widgets/arena/ShieldImage";
import { formatMoscowShort } from "../mainPageTime";
import RespawnActions from "./RespawnActions";
import RespawnHpBar from "./RespawnHpBar";
import { respawnCardView, STATUS_STYLES } from "./respawnModel";

type Props = {
  boss: BossName;
  state: BossRespawnState | null;
  now: Date | null;
  maintenanceWindows: MaintenanceWindow[];
  onRegister: (killTime: Date, action: KillAction) => Promise<boolean>;
};

export default function BossRespawnCard({
  boss,
  state,
  now,
  maintenanceWindows,
  onRegister,
}: Props) {
  const [strikeCount, setStrikeCount] = useState(0);
  const respawnHours = respawnHoursByBoss[boss];
  const view = respawnCardView(state, respawnHours, now, maintenanceWindows);
  const kind = view?.info.kind ?? "none";
  const style = STATUS_STYLES[kind];
  const image = bossImages[boss];

  const handleRegister = async (killTime: Date, action: KillAction) => {
    const isRegistered = await onRegister(killTime, action);
    if (isRegistered) setStrikeCount((count) => count + 1);
    return isRegistered;
  };

  return (
    <article
      aria-label={boss}
      className={cn(
        "arena-cut relative grid grid-cols-[72px_minmax(0,1fr)] gap-x-4 gap-y-3 overflow-hidden border border-l-[3px] bg-card p-4 @xl:grid-cols-[84px_minmax(0,1fr)_200px] @xl:items-center @xl:gap-x-5 @xl:p-5",
        style.accent,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 bg-gradient-to-r to-transparent to-55%",
          style.soft,
        )}
      />
      {strikeCount > 0 && (
        <span key={strikeCount} aria-hidden className="arena-strike" />
      )}
      {image && (
        <ShieldImage
          src={image}
          alt={boss}
          sizes="84px"
          rimClassName={style.fill}
          className={cn(
            "h-[82px] w-[72px] @xl:h-[96px] @xl:w-[84px]",
            kind === "open" && "arena-alert",
          )}
        />
      )}
      <div className="relative flex min-w-0 flex-col gap-1">
        <div className="flex flex-wrap items-baseline justify-between gap-x-2">
          <h3 className="font-display text-xl tracking-wide uppercase">
            {boss}
          </h3>
          <span
            className={cn(
              "font-display text-xs tracking-wide uppercase",
              style.text,
            )}
          >
            {style.label}
          </span>
        </div>
        {view && (
          <p
            className={cn(
              "text-xl leading-tight font-extrabold tabular-nums @xl:text-2xl",
              style.big,
            )}
          >
            {view.text.big}
          </p>
        )}
        {!view && <Skeleton className="h-7 w-40" />}
        <p className="text-xs text-muted-foreground">{view?.text.sub}</p>
        {view && now && "progress" in view.info && (
          <RespawnHpBar
            info={view.info}
            respawnHours={respawnHours}
            now={now}
            fillClassName={style.fill}
          />
        )}
        <p className="text-[11.5px] text-muted-foreground">
          {lastMarkLabel(state, now)}
        </p>
      </div>
      <RespawnActions
        disabled={!view || view.cooldown > 0}
        cooldown={view?.cooldown ?? 0}
        onRegister={handleRegister}
        className="relative col-span-2 @xl:col-span-1"
      />
    </article>
  );
}

function lastMarkLabel(state: BossRespawnState | null, now: Date | null) {
  if (!state?.markedBy || !state.updatedAt || !now) {
    return "Отметок ещё не было";
  }
  const markedAt = formatMoscowShort(new Date(state.updatedAt), now);
  return `Последняя отметка: ${state.markedBy} · ${markedAt}`;
}
