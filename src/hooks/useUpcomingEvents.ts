"use client";

import { useEffect, useState } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import supabase from "@/shared/lib/supabase";
import {
  BossName,
  bosses as respawnBosses,
  respawnHoursByBoss,
  respawnWindow,
  getRespawnStart,
  isMaintenanceWindow,
  maintenanceStartedDuring,
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
  packsNeeded?: number | null;
};

export function packsLabel(n: number): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return `${n} пак`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14))
    return `${n} пака`;
  return `${n} паков`;
}

type BossRespawnState = {
  lastKill: Record<BossName, string | null>;
  packs: Record<BossName, number | null>;
};

// Module-level store shared by every consumer of this hook. UpcomingEvents
// and EventNotifications both render at the same time and each used to open
// its own realtime channel under the same hardcoded name. Supabase's
// `.channel(topic)` returns the *existing* channel when the topic already
// exists, so the second caller's `.on()` landed on a channel the first
// caller had already `.subscribe()`d, which Supabase rejects with "cannot
// add postgres_changes callbacks after subscribe()" (same issue fixed in
// useMaintenanceWindows.ts). Sharing one fetch + one channel across all
// consumers avoids the collision entirely.
let bossRespawnState: BossRespawnState = {
  lastKill: { Марли: null, Морф: null, Кириос: null } as Record<
    BossName,
    string | null
  >,
  packs: { Марли: null, Морф: null, Кириос: null } as Record<
    BossName,
    number | null
  >,
};
const bossRespawnListeners = new Set<(state: BossRespawnState) => void>();
let bossRespawnChannel: RealtimeChannel | null = null;

async function fetchBossRespawn() {
  const { data } = await supabase
    .from("boss_respawn")
    .select("boss_name,last_kill,packs_needed")
    .in("boss_name", respawnBosses);
  if (data) {
    const lastKill = { ...bossRespawnState.lastKill };
    const packs = { ...bossRespawnState.packs };
    data.forEach(
      (row: {
        boss_name: BossName;
        last_kill: string | null;
        packs_needed: number | null;
      }) => {
        lastKill[row.boss_name] = row.last_kill;
        packs[row.boss_name] = row.packs_needed;
      },
    );
    bossRespawnState = { lastKill, packs };
    bossRespawnListeners.forEach((listener) => listener(bossRespawnState));
  }
}

function subscribeBossRespawn(
  listener: (state: BossRespawnState) => void,
): () => void {
  bossRespawnListeners.add(listener);

  if (!bossRespawnChannel) {
    fetchBossRespawn();
    bossRespawnChannel = supabase
      .channel("upcoming-events-boss-respawn")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "boss_respawn" },
        (payload) => {
          const row = payload.new as {
            boss_name: BossName;
            last_kill: string | null;
            packs_needed: number | null;
          };
          if (!row?.boss_name) return;
          bossRespawnState = {
            lastKill: {
              ...bossRespawnState.lastKill,
              [row.boss_name]: row.last_kill,
            },
            packs: {
              ...bossRespawnState.packs,
              [row.boss_name]: row.packs_needed,
            },
          };
          bossRespawnListeners.forEach((l) => l(bossRespawnState));
        },
      )
      .subscribe();
  } else {
    // A subscription already exists: hand the new listener the latest
    // known snapshot instead of waiting for the next change event.
    listener(bossRespawnState);
  }

  return () => {
    bossRespawnListeners.delete(listener);
    if (bossRespawnListeners.size === 0 && bossRespawnChannel) {
      supabase.removeChannel(bossRespawnChannel);
      bossRespawnChannel = null;
    }
  };
}

export function useUpcomingEvents(): UpcomingEvent[] {
  const [{ lastKill: bossLastKill, packs: bossPacks }, setRespawnState] =
    useState<BossRespawnState>(bossRespawnState);
  const [events, setEvents] = useState<UpcomingEvent[]>([]);
  const maintenanceWindows = useMaintenanceWindows();

  useEffect(() => subscribeBossRespawn(setRespawnState), []);

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
        // Проф. работы между киллом и концом окна возможного респауна
        // сбрасывают респавн в игре, даже если сам start не попадает в
        // окно — расчётное время недостоверно, событие не показываем.
        if (maintenanceStartedDuring(new Date(lastKill), end, maintenanceWindows))
          continue;

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
          packsNeeded: bossPacks[boss],
        });
      }

      result.sort((a, b) => a.date.getTime() - b.date.getTime());
      setEvents(result);
    };

    checkEvents();
    const interval = setInterval(checkEvents, 10_000);
    return () => clearInterval(interval);
  }, [bossLastKill, bossPacks, maintenanceWindows]);

  return events;
}
