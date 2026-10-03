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
      return;
    }
    const { registered } = await registerBossKill(
      boss,
      killTime.toISOString(),
      action,
    );
    if (registered) await refreshBossRespawnStatus();
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2">
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
  );
}
