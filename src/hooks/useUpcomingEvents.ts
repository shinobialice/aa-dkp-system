"use client";

import { useEffect, useState } from "react";
import supabase from "@/shared/lib/supabase";
import {
  BossName,
  bosses as respawnBosses,
  respawnHoursByBoss,
  respawnWindow,
  getRespawnStart,
  isMaintenanceWindow,
} from "@/shared/config/bossRespawn";
import {
  schedule,
  dayNames,
  defaultDurationMinutes,
  eventDurationMinutes,
  getMoscowTime,
  getDateWithTime,
} from "@/shared/config/fixedSchedule";
import { useMaintenanceWindows } from "./useMaintenanceWindows";

export const bossImages: Record<string, string> = {
  АГЛ: "/images/ashyara.png",
  Калидис: "/images/kalidis.png",
  Кракен: "/images/kraken.png",
  "Великий луг": "/images/velikii_lug.png",
  Анталлон: "/images/antallon.png",
  Ксанатос: "/images/ksanatos.png",
  Левиафан: "/images/leviathan.png",
  "Оборона Ифнира": "/images/ifnir.png",
  "Осада замка": "/images/osada.png",
  Кошка: "/images/koshka.png",
  Кириос: "/images/kirios.png",
  Марли: "/images/marli.png",
  Морф: "/images/morpheos.png",
  "Пепельные равнины": "/images/pepelki.png",
};

export function formatMoscowHM(date: Date): string {
  return date.toLocaleString("ru-RU", {
    hour12: false,
    timeZone: "Europe/Moscow",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export type UpcomingEvent = {
  boss: string;
  time: string;
  date: Date;
  key: string;
  isNow: boolean;
  startsInMin?: number;
  endsInMin?: number;
};

export function useUpcomingEvents(): UpcomingEvent[] {
  const [bossLastKill, setBossLastKill] = useState<
    Record<BossName, string | null>
  >({ Марли: null, Морф: null, Кириос: null });
  const [events, setEvents] = useState<UpcomingEvent[]>([]);
  const maintenanceWindows = useMaintenanceWindows();

  useEffect(() => {
    async function fetchBossRespawn() {
      const { data } = await supabase
        .from("boss_respawn")
        .select("boss_name,last_kill")
        .in("boss_name", respawnBosses);
      if (data) {
        setBossLastKill((prev) => {
          const next = { ...prev };
          data.forEach(
            (row: { boss_name: BossName; last_kill: string | null }) => {
              next[row.boss_name] = row.last_kill;
            },
          );
          return next;
        });
      }
    }
    fetchBossRespawn();

    const channel = supabase
      .channel("upcoming-events-boss-respawn")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "boss_respawn" },
        (payload) => {
          const row = payload.new as {
            boss_name: BossName;
            last_kill: string | null;
          };
          if (!row?.boss_name) return;
          setBossLastKill((prev) => ({ ...prev, [row.boss_name]: row.last_kill }));
        },
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    const checkEvents = () => {
      const msk = getMoscowTime();
      const realNow = new Date();
      const shift = msk.getTime() - realNow.getTime();

      const result: UpcomingEvent[] = [];

      for (let offset = 0; offset < 7; offset++) {
        const day = dayNames[(msk.getDay() + offset) % 7];
        const dayEvents = schedule[day] || [];

        for (const [time, boss] of dayEvents) {
          const start = getDateWithTime(msk, time, offset);
          const durationMin = eventDurationMinutes[boss] ?? defaultDurationMinutes;
          const end = new Date(start.getTime() + durationMin * 60 * 1000);

          const realStart = new Date(start.getTime() - shift);
          if (isMaintenanceWindow(realStart, maintenanceWindows)) continue;

          const isNow = msk >= start && msk < end;
          const startsInMin = Math.floor(
            (start.getTime() - msk.getTime()) / 60000,
          );
          const endsInMin = isNow
            ? Math.ceil((end.getTime() - msk.getTime()) / 60000)
            : undefined;

          if (msk < end) {
            result.push({
              boss,
              time,
              date: start,
              key: `${boss}__${start.getTime()}`,
              isNow,
              startsInMin,
              endsInMin,
            });
          }
        }
      }

      for (const boss of respawnBosses) {
        const lastKill = bossLastKill[boss];
        if (!lastKill) continue;
        const start = getRespawnStart(lastKill, respawnHoursByBoss[boss]);
        const end = new Date(start.getTime() + respawnWindow * 60 * 60 * 1000);
        if (realNow >= end) continue;
        if (isMaintenanceWindow(start, maintenanceWindows)) continue;

        const isNow = realNow >= start && realNow < end;
        const startsInMin = Math.ceil(
          (start.getTime() - realNow.getTime()) / 60000,
        );
        const endsInMin = isNow
          ? Math.ceil((end.getTime() - realNow.getTime()) / 60000)
          : undefined;

        result.push({
          boss,
          time: formatMoscowHM(start),
          date: new Date(start.getTime() + shift),
          key: `${boss}__${start.getTime()}`,
          isNow,
          startsInMin,
          endsInMin,
        });
      }

      result.sort((a, b) => a.date.getTime() - b.date.getTime());
      setEvents(result);
    };

    checkEvents();
    const interval = setInterval(checkEvents, 10_000);
    return () => clearInterval(interval);
  }, [bossLastKill, maintenanceWindows]);

  return events;
}
