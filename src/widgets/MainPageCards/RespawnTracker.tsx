"use client";

import { useEffect, useState, FC } from "react";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/shared/ui/button";
import useCurrentUser from "@/hooks/useCurrentUser";
import { useMaintenanceWindows } from "@/hooks/useMaintenanceWindows";
import { registerBossKill } from "@/actions/registerBossKill";
import { getBossRespawnStatus } from "@/actions/getBossRespawnStatus";
import { DateTimePopover } from "./DateTimePopover";
import {
  BossName,
  bosses,
  respawnHoursByBoss,
  respawnWindow,
  getRespawnStart,
  getNextMissedCycleStart,
  isMaintenanceWindow,
  maintenanceStartedDuring,
} from "@/shared/config/bossRespawn";

const bossImages: Partial<Record<BossName, string>> = {
  Марли: "/images/marli.png",
  Морф: "/images/morpheos.png",
};
type BossState = {
  lastKill: string | null;
  updatedAt: string | null;
};

const registerCooldownSeconds = 30;

const emptyStates: Record<BossName, BossState> = {
  Марли: { lastKill: null, updatedAt: null },
  Морф: { lastKill: null, updatedAt: null },
};

function formatMoscowDateTime(date: Date): string {
  return date.toLocaleString("ru-RU", {
    hour12: false,
    timeZone: "Europe/Moscow",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const RespawnTracker: FC = () => {
  const maintenanceWindows = useMaintenanceWindows();
  function getRespawnInfo(lastKill: string | null, respawnHours: number) {
    const now = new Date();
    if (isMaintenanceWindow(now, maintenanceWindows))
      return {
        status: "Проф. работы",
        nextRespawn: "-",
        lastKillDisplay: lastKill
          ? formatMoscowDateTime(new Date(lastKill))
          : "Нет данных",
        waiting: false,
        timeLeft: null,
      };
    if (!lastKill)
      return {
        status: "Нет данных",
        nextRespawn: "-",
        lastKillDisplay: "Нет данных",
        waiting: false,
        timeLeft: null,
      };
    const killDate = new Date(lastKill);
    const respawnStart = getRespawnStart(lastKill, respawnHours);
    const respawnEnd = new Date(
      respawnStart.getTime() + respawnWindow * 60 * 60 * 1000,
    );
    if (maintenanceStartedDuring(killDate, respawnEnd, maintenanceWindows))
      return {
        status: "Проф. работы",
        nextRespawn: "-",
        lastKillDisplay: formatMoscowDateTime(killDate),
        waiting: false,
        timeLeft: null,
      };
    let status = "Ожидание";
    let waiting = false;
    let timeLeft: string | null = null;
    let nextRespawnDate = respawnStart;
    if (now < respawnStart) {
      waiting = true;
      const ms = respawnStart.getTime() - now.getTime();
      const totalMinutes = Math.ceil(ms / 60000);
      const h = Math.floor(totalMinutes / 60);
      const m = totalMinutes % 60;
      timeLeft = `${h > 0 ? h + "ч " : ""}${m}мин`;
      status = `Ожидание (${timeLeft})`;
    } else if (now >= respawnStart && now <= respawnEnd) {
      status = "Возможен респаун!";
    } else {
      nextRespawnDate = getNextMissedCycleStart(respawnStart, now, respawnHours);
      const cascadeWindowEnd = new Date(
        nextRespawnDate.getTime() + respawnWindow * 60 * 60 * 1000,
      );
      if (maintenanceStartedDuring(respawnEnd, cascadeWindowEnd, maintenanceWindows)) {
        return {
          status: "Проф. работы",
          nextRespawn: "-",
          lastKillDisplay: formatMoscowDateTime(killDate),
          waiting: false,
          timeLeft: null,
        };
      }
      status = "Проёбано";
    }
    const nextRespawn = formatMoscowDateTime(nextRespawnDate);
    const lastKillDisplay = formatMoscowDateTime(killDate);
    return { status, nextRespawn, lastKillDisplay, waiting, timeLeft };
  }
  const [bossStates, setBossStates] =
    useState<Record<BossName, BossState>>(emptyStates);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<BossName | null>(null);
  const [tick, setTick] = useState(0);
  const user = useCurrentUser();

  useEffect(() => {
    let isMounted = true;
    async function fetchRespawn(isInitial: boolean) {
      if (isInitial) setLoading(true);
      const data = await getBossRespawnStatus(bosses as unknown as string[]);
      if (data && isMounted) {
        const loaded: Record<BossName, BossState> = { ...emptyStates };
        data.forEach(
          (row: {
            boss_name: BossName;
            last_kill: string | null;
            updated_at: string | null;
          }) => {
            loaded[row.boss_name] = {
              lastKill: row.last_kill,
              updatedAt: row.updated_at,
            };
          },
        );
        setBossStates(loaded);
      }
      if (isInitial) setLoading(false);
    }
    fetchRespawn(true);
    const interval = setInterval(() => fetchRespawn(false), 15_000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick((t) => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  async function saveRespawn(boss: BossName, iso: string, action: string) {
    if (!user) {
      alert("Вы должны быть авторизованы для изменения времени!");
      return;
    }
    if (isOnCooldown(boss)) return;
    setSaving(boss);
    const { registered } = await registerBossKill(
      boss,
      iso,
      action,
      user.id,
      registerCooldownSeconds,
    );
    if (registered) {
      setBossStates((prev) => ({
        ...prev,
        [boss]: {
          ...prev[boss],
          lastKill: iso,
          updatedAt: new Date().toISOString(),
        },
      }));
    }
    setSaving(null);
  }

  function isOnCooldown(boss: BossName): boolean {
    const updatedAt = bossStates[boss].updatedAt;
    if (!updatedAt) return false;
    const elapsedMs = Date.now() - new Date(updatedAt).getTime();
    return elapsedMs < registerCooldownSeconds * 1000;
  }

  function cooldownSecondsLeft(boss: BossName): number {
    const updatedAt = bossStates[boss].updatedAt;
    if (!updatedAt) return 0;
    const elapsedMs = Date.now() - new Date(updatedAt).getTime();
    return Math.max(0, Math.ceil((registerCooldownSeconds * 1000 - elapsedMs) / 1000));
  }

  function handleKilledNow(boss: BossName) {
    const now = new Date().toISOString();
    saveRespawn(boss, now, "Убит сейчас");
  }

  const [popoverDate, setPopoverDate] = useState<Record<BossName, Date | null>>(
    {
      Марли: null,
      Морф: null,
    },
  );
  function handleConfirmSetTime(boss: BossName) {
    const date = popoverDate[boss];
    if (!date) return;
    setPopoverDate((prev) => ({ ...prev, [boss]: null }));
    saveRespawn(boss, date.toISOString(), "Указано время");
  }

  function getStatusColor(status: string) {
    if (status === "Проф. работы") return "text-orange-500 font-semibold";
    if (status.startsWith("Ожидание (")) return "text-yellow-500 font-semibold";
    if (status === "Возможен респаун!") return "text-green-600 font-bold";
    if (status === "Проёбано") return "text-red-600 font-bold";
    if (status === "Нет данных") return "text-gray-400";
    return "text-gray-700";
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-fixed text-sm border">
        <thead>
          <tr className="bg-muted">
            <th className="p-2 border w-[100px]">Название</th>
            <th className="p-2 border w-[125px]">Время респауна</th>
            <th className="p-2 border w-[125px]">Статус</th>
            <th className="p-2 border w-[125px]">Следующий респаун</th>
            <th className="p-2 border w-[125px]">Последнее убийство</th>
            <th className="p-2 border w-[136px]">Действия</th>
          </tr>
        </thead>
        <tbody>
          {bosses.map((boss) => {
            const state = bossStates[boss];
            const respawnHours = respawnHoursByBoss[boss];
            const info = getRespawnInfo(state.lastKill, respawnHours);
            return (
              <tr key={boss}>
                <td className="p-2 border font-bold">
                  <div className="flex flex-col items-center justify-center gap-1">
                    {bossImages[boss] && (
                      <Image
                        src={bossImages[boss]!}
                        alt={boss}
                        width={64}
                        height={64}
                        className="rounded-md object-cover"
                      />
                    )}
                    {boss}
                  </div>
                </td>
                <td className="p-2 border">
                  {respawnHours} ч.
                  <br />
                  (+ {respawnWindow} ч. промежуток)
                </td>
                <td className={`p-2 border`}>
                  <span className={getStatusColor(info.status)}>
                    {info.waiting ? (
                      <>
                        Ожидание
                        <br />
                        {info.timeLeft}
                      </>
                    ) : (
                      info.status
                    )}
                  </span>
                </td>
                <td className="p-2 border font-bold">{info.nextRespawn}</td>
                <td className="p-2 border">{info.lastKillDisplay}</td>
                <td className="p-2 border">
                  <div className="flex flex-col items-center gap-2">
                    <Button
                      className="w-[120px] cursor-pointer text-xs px-1"
                      onClick={() => handleKilledNow(boss)}
                      disabled={saving === boss || loading || isOnCooldown(boss)}
                    >
                      {saving === boss && (
                        <Loader2 className="mr-1 size-3 animate-spin" />
                      )}
                      {isOnCooldown(boss)
                        ? `КД ${cooldownSecondsLeft(boss)}с`
                        : "Был убит сейчас"}
                    </Button>
                    <DateTimePopover
                      value={popoverDate[boss]}
                      onChange={(date) =>
                        setPopoverDate((prev) => ({ ...prev, [boss]: date }))
                      }
                      onConfirm={() => handleConfirmSetTime(boss)}
                    >
                      <Button
                        className="w-[120px] cursor-pointer text-xs px-1"
                        variant="outline"
                        disabled={saving === boss || loading || isOnCooldown(boss)}
                        onClick={() => {}}
                      >
                        {saving === boss && (
                          <Loader2 className="mr-1 size-3 animate-spin" />
                        )}
                        Установить время
                      </Button>
                    </DateTimePopover>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default RespawnTracker;
