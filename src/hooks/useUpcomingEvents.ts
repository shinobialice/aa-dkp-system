"use client";

import { useEffect, useState } from "react";
import { getBossRespawnStatus } from "@/actions/getBossRespawnStatus";
import {
  BossName,
  bosses as respawnBosses,
  respawnHoursByBoss,
  respawnWindow,
  getRespawnStart,
  isMaintenanceWindow,
  maintenanceStartedDuring,
  getRecurringMaintenanceWindowInDays,
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
  АГЛ: "/images/bosses/ashyara.png",
  Калидис: "/images/bosses/kalidis.png",
  Кракен: "/images/bosses/kraken.png",
  "Великий луг": "/images/bosses/velikii_lug.png",
  Анталлон: "/images/bosses/antallon.png",
  Ксанатос: "/images/bosses/ksanatos.png",
  Левиафан: "/images/bosses/leviathan.png",
  "Оборона Ифнира": "/images/bosses/ifnir.png",
  "Осада замка": "/images/bosses/osada.png",
  Кошка: "/images/bosses/koshka.png",
  Марли: "/images/bosses/marli.png",
  Морф: "/images/bosses/morpheos.png",
  "Пепельные равнины": "/images/bosses/pepelki.png",
  "Проф. работы": "/images/bosses/prof.png",
};

const maintenanceEventName = "Проф. работы";

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

type BossRespawnState = {
  lastKill: Record<BossName, string | null>;
};

// Module-level store shared by every consumer of this hook. UpcomingEvents
// and EventNotifications both render at the same time — вместо
// realtime-подписки (была у Supabase, self-hosted Postgres такого не даёт)
// держим один общий поллинг на всех потребителей, чтобы не плодить лишние
// запросы (тот же приём, что в useMaintenanceWindows.ts).
let bossRespawnState: BossRespawnState = {
  lastKill: { Марли: null, Морф: null } as Record<BossName, string | null>,
};
const bossRespawnListeners = new Set<(state: BossRespawnState) => void>();
let bossRespawnPollTimer: ReturnType<typeof setInterval> | null = null;

async function fetchBossRespawn() {
  const data = await getBossRespawnStatus(respawnBosses as unknown as string[]);
  if (data) {
    const lastKill = { ...bossRespawnState.lastKill };
    data.forEach(
      (row: { boss_name: BossName; last_kill: string | null }) => {
        lastKill[row.boss_name] = row.last_kill;
      },
    );
    bossRespawnState = { lastKill };
    bossRespawnListeners.forEach((listener) => listener(bossRespawnState));
  }
}

function subscribeBossRespawn(
  listener: (state: BossRespawnState) => void,
): () => void {
  bossRespawnListeners.add(listener);

  if (!bossRespawnPollTimer) {
    fetchBossRespawn();
    bossRespawnPollTimer = setInterval(fetchBossRespawn, 15_000);
  } else {
    // Поллинг уже идёт: отдаём новому подписчику последний известный снимок,
    // не дожидаясь следующего тика.
    listener(bossRespawnState);
  }

  return () => {
    bossRespawnListeners.delete(listener);
    if (bossRespawnListeners.size === 0 && bossRespawnPollTimer) {
      clearInterval(bossRespawnPollTimer);
      bossRespawnPollTimer = null;
    }
  };
}

export function useUpcomingEvents(): UpcomingEvent[] {
  const [{ lastKill: bossLastKill }, setRespawnState] =
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

      // Окна проф. работ — регулярные четверговые на неделю вперёд и все
      // внеплановые (включая продления штатного окна). Продление обычно
      // начинается ровно в момент конца штатного окна ("Продлить" в
      // настройках), так что окна нужно склеивать в одну карточку, а не
      // показывать два "Проф. работы" подряд.
      const maintenanceRanges: { start: Date; end: Date }[] = [];
      for (let offset = 0; offset < 7; offset++) {
        const recurring = getRecurringMaintenanceWindowInDays(offset);
        if (recurring) maintenanceRanges.push(recurring);
      }
      for (const w of maintenanceWindows) {
        maintenanceRanges.push({
          start: new Date(w.startAt),
          end: new Date(w.endAt),
        });
      }
      maintenanceRanges.sort((a, b) => a.start.getTime() - b.start.getTime());

      const mergedMaintenance: { start: Date; end: Date }[] = [];
      for (const range of maintenanceRanges) {
        const last = mergedMaintenance[mergedMaintenance.length - 1];
        if (last && range.start.getTime() <= last.end.getTime()) {
          if (range.end.getTime() > last.end.getTime()) last.end = range.end;
        } else {
          mergedMaintenance.push({ start: range.start, end: range.end });
        }
      }

      for (const { start, end } of mergedMaintenance) {
        if (realNow >= end) continue;

        const isNow = realNow >= start && realNow < end;
        const startsInMin = Math.ceil(
          (start.getTime() - realNow.getTime()) / 60000,
        );
        const endsInMin = isNow
          ? Math.ceil((end.getTime() - realNow.getTime()) / 60000)
          : undefined;

        result.push({
          boss: maintenanceEventName,
          time: `${formatMoscowHM(start)}-${formatMoscowHM(end)}`,
          date: new Date(start.getTime() + shift),
          key: `${maintenanceEventName}__${start.getTime()}`,
          isNow,
          startsInMin,
          endsInMin,
        });
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
