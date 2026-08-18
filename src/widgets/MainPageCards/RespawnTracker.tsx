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
import { PacksPopover } from "./PacksPopover";
import {
  BossName,
  bosses,
  respawnHoursByBoss,
  respawnWindow,
  getRespawnStart,
  isMaintenanceWindow,
  maintenanceStartedDuring,
} from "@/shared/config/bossRespawn";

const bossImages: Partial<Record<BossName, string>> = {
  Кириос: "/images/kirios.png",
  Марли: "/images/marli.png",
  Морф: "/images/morpheos.png",
};
type BossState = {
  lastKill: string | null; // ISO string
  packsNeeded: number | null;
  updatedAt: string | null; // ISO string, момент последней регистрации
};

const registerCooldownSeconds = 30;

const emptyStates: Record<BossName, BossState> = {
  Марли: { lastKill: null, packsNeeded: null, updatedAt: null },
  Морф: { lastKill: null, packsNeeded: null, updatedAt: null },
  Кириос: { lastKill: null, packsNeeded: null, updatedAt: null },
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
    // Если между киллом и концом окна возможного респауна сервер уходил на
    // проф. работы (плановые или внеплановые) — игра сама сбрасывает
    // респавн, и расчётное время недостоверно, даже если сам respawnStart
    // не попадает в окно (пример: убили в 15:00, профы 16:00-17:00,
    // расчётный респавн в 03:00 — но по факту он сброшен и неизвестен).
    if (maintenanceStartedDuring(killDate, respawnEnd, maintenanceWindows))
      return {
        status: "Неизвестно",
        nextRespawn: "-",
        lastKillDisplay: formatMoscowDateTime(killDate),
        waiting: false,
        timeLeft: null,
      };
    let status = "Ожидание";
    let waiting = false;
    let timeLeft: string | null = null;
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
      status = "Ожидание убийства";
    }
    const nextRespawn = formatMoscowDateTime(respawnStart);
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
            packs_needed: number | null;
            updated_at: string | null;
          }) => {
            loaded[row.boss_name] = {
              lastKill: row.last_kill,
              packsNeeded: row.packs_needed,
              updatedAt: row.updated_at,
            };
          },
        );
        setBossStates(loaded);
      }
      if (isInitial) setLoading(false);
    }
    fetchRespawn(true);
    // Поллинг вместо realtime-подписки (self-hosted Postgres без Supabase
    // Realtime) — тихо обновляем состояние боссов раз в 15 секунд.
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

  async function saveRespawn(
    boss: BossName,
    iso: string,
    action: string,
    packsNeeded?: number,
  ) {
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
      packsNeeded,
    );
    if (registered) {
      setBossStates((prev) => ({
        ...prev,
        [boss]: {
          ...prev[boss],
          lastKill: iso,
          updatedAt: new Date().toISOString(),
          packsNeeded: packsNeeded ?? prev[boss].packsNeeded,
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

  const [pendingKill, setPendingKill] = useState<
    { boss: BossName; iso: string; action: string } | null
  >(null);

  function beginKill(boss: BossName, iso: string, action: string) {
    if (boss === "Кириос") {
      setPendingKill({ boss, iso, action });
    } else {
      saveRespawn(boss, iso, action);
    }
  }

  function confirmPendingKillPacks(packs: number) {
    if (!pendingKill) return;
    saveRespawn(pendingKill.boss, pendingKill.iso, pendingKill.action, packs);
    setPendingKill(null);
  }

  function handleKilledNow(boss: BossName) {
    const now = new Date().toISOString();
    beginKill(boss, now, boss === "Кириос" ? "Реснулся" : "Убит сейчас");
  }

  const [popoverDate, setPopoverDate] = useState<Record<BossName, Date | null>>(
    {
      Марли: null,
      Морф: null,
      Кириос: null,
    },
  );
  function handleConfirmSetTime(boss: BossName) {
    const date = popoverDate[boss];
    if (!date) return;
    setPopoverDate((prev) => ({ ...prev, [boss]: null }));
    beginKill(boss, date.toISOString(), "Указано время");
  }

  function getStatusColor(status: string) {
    if (status === "Проф. работы") return "text-orange-500 font-semibold";
    if (status.startsWith("Ожидание (")) return "text-yellow-500 font-semibold";
    if (status === "Возможен респаун!") return "text-green-600 font-bold";
    if (status === "Ожидание убийства") return "text-blue-500 font-semibold";
    if (status === "Нет данных") return "text-gray-400";
    if (status === "Неизвестно") return "text-orange-400 font-semibold";
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
            <th className="p-2 border w-[60px]">Паков</th>
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
                <td className="p-2 border">{info.nextRespawn}</td>
                <td className="p-2 border">{info.lastKillDisplay}</td>
                <td className="p-2 border">
                  {boss === "Кириос" ? state.packsNeeded ?? "-" : "-"}
                </td>
                <td className="p-2 border">
                  <PacksPopover
                    open={pendingKill?.boss === boss}
                    onOpenChange={(open) => {
                      if (!open) setPendingKill(null);
                    }}
                    onSelect={confirmPendingKillPacks}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Button
                        className="w-[120px] cursor-pointer text-xs px-1"
                        onClick={() => handleKilledNow(boss)}
                        disabled={
                          saving === boss ||
                          loading ||
                          isOnCooldown(boss) ||
                          pendingKill?.boss === boss
                        }
                      >
                        {saving === boss && (
                          <Loader2 className="mr-1 size-3 animate-spin" />
                        )}
                        {isOnCooldown(boss)
                          ? `КД ${cooldownSecondsLeft(boss)}с`
                          : boss === "Кириос"
                            ? "Реснулся"
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
                          disabled={
                            saving === boss ||
                            loading ||
                            isOnCooldown(boss) ||
                            pendingKill?.boss === boss
                          }
                          onClick={() => {}}
                        >
                          {saving === boss && (
                            <Loader2 className="mr-1 size-3 animate-spin" />
                          )}
                          Установить время
                        </Button>
                      </DateTimePopover>
                    </div>
                  </PacksPopover>
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
