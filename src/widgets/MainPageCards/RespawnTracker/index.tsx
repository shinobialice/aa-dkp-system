"use client";

import { toast } from "sonner";
import { registerBossKill } from "@/actions/registerBossKill";
import {
  refreshBossRespawnStatus,
  useBossRespawnStatus,
} from "@/hooks/useBossRespawnStatus";
import { useClock } from "@/hooks/useClock";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useMaintenanceWindows } from "@/hooks/useMaintenanceWindows";
import {
  bosses,
  type BossName,
  type KillAction,
} from "@/shared/config/bossRespawn";
import BossRespawnHistory from "../BossRespawnHistory";
import BossRespawnCard from "./BossRespawnCard";

const CLOCK_TICK_MS = 1000;

export default function RespawnTracker() {
  const states = useBossRespawnStatus();
  const maintenanceWindows = useMaintenanceWindows();
  const clock = useClock(CLOCK_TICK_MS);
  const user = useCurrentUser();

  const handleRegister = async (
    boss: BossName,
    killTime: Date,
    action: KillAction,
  ) => {
    if (!user) {
      toast.error("Вы должны быть авторизованы для изменения времени!");
      return false;
    }
    const { registered } = await registerBossKill(
      boss,
      killTime.toISOString(),
      action,
    );
    if (registered) await refreshBossRespawnStatus();
    return registered;
  };

  return (
    <section
      aria-label="Респаун боссов"
      className="flex min-w-0 flex-col gap-3"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <div className="flex items-baseline gap-2.5">
          <h2 className="font-display text-lg tracking-wide uppercase">
            Респаун
          </h2>
          <span className="text-xs text-muted-foreground">
            обновляется само
          </span>
        </div>
        <BossRespawnHistory />
      </div>
      <div className="@container flex flex-col gap-3.5">
        {bosses.map((boss) => (
          <BossRespawnCard
            key={boss}
            boss={boss}
            state={states?.[boss] ?? null}
            now={clock === null ? null : new Date(clock)}
            maintenanceWindows={maintenanceWindows}
            onRegister={(killTime, action) =>
              handleRegister(boss, killTime, action)
            }
          />
        ))}
      </div>
    </section>
  );
}
