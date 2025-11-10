"use client";

import { useEffect, useState, FC } from "react";
import { Button } from "@/shared/ui/button";
import supabase from "@/shared/lib/supabase";
import useCurrentUser from "@/hooks/useCurrentUser";
import { DateTimePopover } from "./DateTimePopover";

type BossName = "Марли" | "Морф";
type BossState = {
  lastKill: string | null; // ISO string
};
const respawnHours = 12;
const respawnWindow = 1; // hours
const bosses: BossName[] = ["Марли", "Морф"];

const RespawnTracker: FC = () => {
  function getRespawnInfo(lastKill: string | null) {
    if (!lastKill)
      return {
        status: "Нет данных",
        nextRespawn: "-",
        lastKillDisplay: "Нет данных",
        waiting: false,
        timeLeft: null,
      };
    const killDate = new Date(lastKill);
    const respawnStart = new Date(
      killDate.getTime() + respawnHours * 60 * 60 * 1000,
    );
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
      const h = Math.floor(ms / 3600000);
      const m = Math.floor((ms % 3600000) / 60000);
      const s = Math.floor((ms % 60000) / 1000);
      timeLeft = `${h > 0 ? h + "ч " : ""}${m > 0 ? m + "мин " : ""}${s}с`;
      status = `Ожидание (${timeLeft})`;
    } else if (now >= respawnStart && now <= respawnEnd) {
      status = "Возможен респаун!";
    } else {
      status = "Ожидание убийства";
    }
    const nextRespawn = `${respawnStart.toLocaleString("ru-RU", { hour12: false, timeZone: "Europe/Moscow" })} (МСК)`;
    const lastKillDisplay = `${killDate.toLocaleString("ru-RU", { hour12: false, timeZone: "Europe/Moscow" })} (МСК)`;
    return { status, nextRespawn, lastKillDisplay, waiting, timeLeft };
  }
  const [bossStates, setBossStates] = useState<Record<BossName, BossState>>({
    Марли: { lastKill: null },
    Морф: { lastKill: null },
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<BossName | null>(null);
  const [tick, setTick] = useState(0);
  const user = useCurrentUser();

  useEffect(() => {
    async function fetchRespawn() {
      setLoading(true);
      const { data } = await supabase
        .from("boss_respawn")
        .select("boss_name,last_kill")
        .in("boss_name", bosses);
      if (data) {
        const loaded: Record<BossName, BossState> = {
          Марли: { lastKill: null },
          Морф: { lastKill: null },
        };
        data.forEach((row: { boss_name: BossName; last_kill: string }) => {
          loaded[row.boss_name] = { lastKill: row.last_kill };
        });
        setBossStates(loaded);
      }
      setLoading(false);
    }
    fetchRespawn();
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
    setSaving(boss);
    await supabase.from("boss_respawn").upsert(
      {
        boss_name: boss,
        last_kill: iso,
        updated_by: user.id,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "boss_name" },
    );
    const prevKill = bossStates[boss].lastKill;
    const killDate = new Date(iso);
    const nextRespawn = new Date(
      killDate.getTime() + respawnHours * 60 * 60 * 1000,
    );
    await supabase.from("boss_respawn_history").insert({
      boss_name: boss,
      action,
      kill_time: iso,
      prev_kill_time: prevKill,
      next_respawn: nextRespawn.toISOString(),
      user_id: user.id,
      created_at: new Date().toISOString(),
    });
    setBossStates((prev) => ({ ...prev, [boss]: { lastKill: iso } }));
    setSaving(null);
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
      <table className="min-w-full text-sm border">
        <thead>
          <tr className="bg-muted">
            <th className="p-2 border">Название</th>
            <th className="p-2 border">Время респауна</th>
            <th className="p-2 border">Статус</th>
            <th className="p-2 border">Следующий респаун</th>
            <th className="p-2 border">Последнее убийство</th>
            <th className="p-2 border">Действия</th>
          </tr>
        </thead>
        <tbody>
          {bosses.map((boss) => {
            const state = bossStates[boss];
            const info = getRespawnInfo(state.lastKill);
            return (
              <tr key={boss}>
                <td className="p-2 border font-bold">{boss}</td>
                <td className="p-2 border">12 ч. (+ 1 ч. промежуток)</td>
                <td className={`p-2 border`}>
                  <span className={getStatusColor(info.status)}>
                    {info.status}
                  </span>
                </td>
                <td className="p-2 border">{info.nextRespawn}</td>
                <td className="p-2 border">{info.lastKillDisplay}</td>
                <td className="p-2 border">
                  <div className="flex flex-col items-center gap-2">
                    <Button
                      className="w-[150px] cursor-pointer"
                      onClick={() => handleKilledNow(boss)}
                      disabled={saving === boss || loading}
                    >
                      {saving === boss ? "Сохр..." : "Был убит сейчас"}
                    </Button>
                    <DateTimePopover
                      value={popoverDate[boss]}
                      onChange={(date) => {
                        setPopoverDate((prev) => ({ ...prev, [boss]: date }));
                        if (date) handleSetTime(boss, date);
                      }}
                    >
                      <Button
                        className="w-[150px] cursor-pointer"
                        variant="outline"
                        disabled={saving === boss || loading}
                        onClick={() => {}}
                      >
                        {saving === boss ? "Сохр..." : "Установить время"}
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
