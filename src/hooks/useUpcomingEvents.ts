"use client";

import { useEffect, useState } from "react";
import supabase from "@/shared/lib/supabase";
import {
  BossName,
  bosses as respawnBosses,
  respawnHoursByBoss,
  respawnWindow,
  getRespawnStart,
} from "@/shared/config/bossRespawn";

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

const schedule: Record<string, [string, string][]> = {
  Понедельник: [
    ["07:20", "АГЛ"],
    ["10:00", "Кошка"],
    ["11:20", "АГЛ"],
    ["15:20", "АГЛ"],
    ["16:00", "Пепельные равнины"],
    ["19:20", "АГЛ"],
    ["19:30", "Кракен"],
    ["20:00", "Пепельные равнины"],
    ["20:30", "Калидис"],
    ["21:30", "Анталлон"],
    ["22:00", "Кошка"],
    ["23:20", "АГЛ"],
    ["03:20", "АГЛ"],
  ],
  Вторник: [
    ["07:20", "АГЛ"],
    ["10:00", "Кошка"],
    ["11:20", "АГЛ"],
    ["15:20", "АГЛ"],
    ["19:20", "АГЛ"],
    ["19:30", "Ксанатос"],
    ["20:30", "Левиафан"],
    ["22:00", "Кошка"],
    ["23:20", "АГЛ"],
    ["03:20", "АГЛ"],
  ],
  Среда: [
    ["07:20", "АГЛ"],
    ["10:00", "Кошка"],
    ["11:20", "АГЛ"],
    ["15:20", "АГЛ"],
    ["16:00", "Пепельные равнины"],
    ["19:20", "АГЛ"],
    ["20:00", "Пепельные равнины"],
    ["21:00", "Осада замка"],
    ["22:00", "Кошка"],
    ["23:20", "АГЛ"],
    ["03:20", "АГЛ"],
  ],
  Четверг: [
    ["07:20", "АГЛ"],
    ["10:00", "Кошка"],
    ["11:20", "АГЛ"],
    ["15:20", "АГЛ"],
    ["16:00", "Пепельные равнины"],
    ["19:20", "АГЛ"],
    ["19:30", "Кракен"],
    ["20:00", "Пепельные равнины"],
    ["20:30", "Левиафан"],
    ["22:00", "Кошка"],
    ["23:20", "АГЛ"],
    ["03:20", "АГЛ"],
  ],
  Пятница: [
    ["07:20", "АГЛ"],
    ["10:00", "Кошка"],
    ["11:20", "АГЛ"],
    ["15:20", "АГЛ"],
    ["16:00", "Пепельные равнины"],
    ["19:20", "АГЛ"],
    ["19:30", "Ксанатос"],
    ["20:00", "Пепельные равнины"],
    ["20:30", "Калидис"],
    ["21:30", "Анталлон"],
    ["22:00", "Оборона Ифнира"],
    ["22:00", "Кошка"],
    ["23:20", "АГЛ"],
    ["03:20", "АГЛ"],
  ],
  Суббота: [
    ["07:20", "АГЛ"],
    ["10:00", "Кошка"],
    ["11:20", "АГЛ"],
    ["15:20", "АГЛ"],
    ["16:00", "Оборона Ифнира"],
    ["16:00", "Пепельные равнины"],
    ["18:00", "Великий луг"],
    ["19:20", "АГЛ"],
    ["19:30", "Кракен"],
    ["20:00", "Пепельные равнины"],
    ["20:30", "Калидис"],
    ["22:00", "Кошка"],
    ["23:20", "АГЛ"],
    ["03:20", "АГЛ"],
  ],
  Воскресенье: [
    ["07:20", "АГЛ"],
    ["10:00", "Кошка"],
    ["11:20", "АГЛ"],
    ["15:20", "АГЛ"],
    ["18:00", "Великий луг"],
    ["19:20", "АГЛ"],
    ["19:30", "Ксанатос"],
    ["19:50", "Анталлон"],
    ["20:30", "Левиафан"],
    ["22:00", "Кошка"],
    ["23:20", "АГЛ"],
    ["03:20", "АГЛ"],
  ],
};

const defaultDurationMinutes = 60;
const eventDurationMinutes: Record<string, number> = {
  АГЛ: 30,
};

const dayNames = [
  "Воскресенье",
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
];

function getMoscowTime(): Date {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + 3 * 60 * 60 * 1000);
}

function getDateWithTime(now: Date, timeStr: string, dayOffset = 0): Date {
  const [h, m] = timeStr.split(":").map(Number);
  const d = new Date(now);
  d.setDate(d.getDate() + dayOffset);
  d.setHours(h, m, 0, 0);
  return d;
}

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
  }, [bossLastKill]);

  return events;
}
