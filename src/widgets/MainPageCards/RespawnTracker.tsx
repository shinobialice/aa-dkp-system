"use client";

import { useEffect, useState, FC } from "react";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui";
import supabase from "@/shared/lib/supabase";
import useCurrentUser from "@/hooks/useCurrentUser";
import { registerBossKill } from "@/actions/registerBossKill";
import { DateTimePopover } from "./DateTimePopover";
import {
  BossName,
  bosses,
  respawnHoursByBoss,
  respawnWindow,
  getRespawnStart,
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
  function getRespawnInfo(lastKill: string | null, respawnHours: number) {
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
    const now = new Date();
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
    async function fetchRespawn() {
      setLoading(true);
      const { data } = await supabase
        .from("boss_respawn")
        .select("boss_name,last_kill,packs_needed,updated_at")
        .in("boss_name", bosses);
      if (data) {
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
      setLoading(false);
    }
    fetchRespawn();
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel("boss_respawn-changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "boss_respawn" },
        (payload) => {
          const row = payload.new as {
            boss_name: BossName;
            last_kill: string | null;
            packs_needed: number | null;
            updated_at: string | null;
          };
          if (!row?.boss_name) return;
          setBossStates((prev) => ({
            ...prev,
            [row.boss_name]: {
              lastKill: row.last_kill,
              packsNeeded: row.packs_needed,
              updatedAt: row.updated_at,
            },
          }));
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
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
        [boss]: { ...prev[boss], lastKill: iso, updatedAt: new Date().toISOString() },
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

  async function handlePacksChange(boss: BossName, value: number | null) {
    setBossStates((prev) => ({
      ...prev,
      [boss]: { ...prev[boss], packsNeeded: value },
    }));
    await supabase
      .from("boss_respawn")
      .upsert(
        { boss_name: boss, packs_needed: value },
        { onConflict: "boss_name" },
      );
  }

  function handleKilledNow(boss: BossName) {
    const now = new Date().toISOString();
    saveRespawn(boss, now, boss === "Кириос" ? "Реснулся" : "Убит сейчас");
  }

  const [popoverDate, setPopoverDate] = useState<Record<BossName, Date | null>>(
    {
      Марли: null,
      Морф: null,
      Кириос: null,
    },
  );
  function handleSetTime(boss: BossName, date: Date | null) {
    if (!date) return;
    const iso = date.toISOString();
    saveRespawn(boss, iso, "Указано время");
    setPopoverDate((prev) => ({ ...prev, [boss]: null }));
  }

  function getStatusColor(status: string) {
    if (status.startsWith("Ожидание (")) return "text-yellow-500 font-semibold";
    if (status === "Возможен респаун!") return "text-green-600 font-bold";
    if (status === "Ожидание убийства") return "text-blue-500 font-semibold";
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
                  {respawnHours} ч. (+ {respawnWindow} ч. промежуток)
                </td>
                <td className={`p-2 border`}>
                  <span className={getStatusColor(info.status)}>
                    {info.status}
                  </span>
                </td>
                <td className="p-2 border">{info.nextRespawn}</td>
                <td className="p-2 border">{info.lastKillDisplay}</td>
                <td className="p-2 border">
                  {boss === "Кириос" ? (
                    <Input
                      type="number"
                      value={state.packsNeeded ?? ""}
                      onChange={(e) =>
                        handlePacksChange(
                          boss,
                          e.target.value === "" ? null : Number(e.target.value),
                        )
                      }
                      className="w-12 px-1"
                    />
                  ) : (
                    "-"
                  )}
                </td>
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
                        : boss === "Кириос"
                          ? "Реснулся"
                          : "Был убит сейчас"}
                    </Button>
                    <DateTimePopover
                      value={popoverDate[boss]}
                      onChange={(date) => {
                        setPopoverDate((prev) => ({ ...prev, [boss]: date }));
                        if (date) handleSetTime(boss, date);
                      }}
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
