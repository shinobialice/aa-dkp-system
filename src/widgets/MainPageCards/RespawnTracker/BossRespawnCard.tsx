import type { BossRespawnState } from "@/hooks/useBossRespawnStatus";
import {
  respawnHoursByBoss,
  type BossName,
  type KillAction,
  type MaintenanceWindow,
} from "@/shared/config/bossRespawn";
import { cn } from "@/shared/lib/tw-merge";
import { formatMoscowShort } from "../mainPageTime";
import BossRespawnHeader from "./BossRespawnHeader";
import RespawnActions from "./RespawnActions";
import RespawnProgress from "./RespawnProgress";
import { respawnCardView, STATUS_STYLES } from "./respawnModel";

type Props = {
  boss: BossName;
  state: BossRespawnState | null;
  now: Date | null;
  maintenanceWindows: MaintenanceWindow[];
  onRegister: (killTime: Date, action: KillAction) => Promise<void>;
};

export default function BossRespawnCard({
  boss,
  state,
  now,
  maintenanceWindows,
  onRegister,
}: Props) {
  const respawnHours = respawnHoursByBoss[boss];
  const view = respawnCardView(state, respawnHours, now, maintenanceWindows);
  const style = STATUS_STYLES[view?.info.kind ?? "none"];

  return (
    <article className="flex min-w-0 flex-col gap-3.5 rounded-xl border bg-card p-4 shadow-xs">
      <BossRespawnHeader
        boss={boss}
        respawnHours={respawnHours}
        style={style}
      />

      <div>
        {view && (
          <p
            className={cn(
              "text-2xl leading-tight font-bold tracking-tight",
              style.big,
            )}
          >
            {view.text.big}
          </p>
        )}
        {!view && (
          <div className="h-8 w-40 animate-pulse rounded-md bg-muted" />
        )}
        <p className="text-sm text-muted-foreground">{view?.text.sub}</p>
      </div>

      {view && now && "progress" in view.info && (
        <RespawnProgress
          info={view.info}
          respawnHours={respawnHours}
          now={now}
        />
      )}

      <RespawnActions
        disabled={!view || view.cooldown > 0}
        cooldown={view?.cooldown ?? 0}
        onRegister={onRegister}
      />

      <p className="border-t pt-2.5 text-xs text-muted-foreground">
        {lastMarkLabel(state, now)}
      </p>
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
