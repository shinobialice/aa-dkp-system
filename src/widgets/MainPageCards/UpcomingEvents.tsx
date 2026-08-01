"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";

const bossImages: Record<string, string> = {
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
};

const schedule: Record<string, [string, string][]> = {
  Понедельник: [
    ["07:20", "АГЛ"],
    ["10:00", "Кошка"],
    ["11:20", "АГЛ"],
    ["15:20", "АГЛ"],
    ["19:20", "АГЛ"],
    ["19:30", "Кракен"],
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
    ["19:20", "АГЛ"],
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
    ["19:20", "АГЛ"],
    ["19:30", "Кракен"],
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
    ["19:20", "АГЛ"],
    ["19:30", "Ксанатос"],
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
    ["18:00", "Великий луг"],
    ["19:20", "АГЛ"],
    ["19:30", "Кракен"],
    ["21:00", "Калидис"],
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

function formatMinutes(mins: number): string {
  const h = Math.floor(Math.abs(mins) / 60);
  const m = Math.abs(mins) % 60;
  if (h === 0) return `${m} мин`;
  return `${h} ч ${m} мин`;
}

export default function UpcomingEvents() {
  const [now, setNow] = useState(getMoscowTime());
  const [events, setEvents] = useState<
    {
      boss: string;
      time: string;
      date: Date;
      isNow: boolean;
      startsInMin?: number;
      endsInMin?: number;
    }[]
  >([]);

  useEffect(() => {
    const checkEvents = () => {
      const msk = getMoscowTime();
      setNow(msk);

      const result: typeof events = [];

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

          if (startsInMin >= -60) {
            result.push({
              boss,
              time,
              date: start,
              isNow,
              startsInMin,
              endsInMin,
            });
          }
        }
      }

      result.sort((a, b) => a.date.getTime() - b.date.getTime());
      setEvents(result.slice(0, 5));
    };

    checkEvents();
    const interval = setInterval(checkEvents, 10_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {events.map((e, i) => (
        <Card
          key={i}
          className={
            "flex-row items-center justify-between gap-4" +
            (e.isNow ? " border-primary bg-muted shadow-md" : " opacity-90")
          }
        >
          <div className="min-w-0 flex-1">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <span>{e.boss}</span>
                {e.isNow && <span className="text-primary text-sm">⏱</span>}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <div>🕓 {e.time} МСК</div>
              {e.isNow ? (
                <div className="text-xs text-muted-foreground">
                  До конца: {formatMinutes(e.endsInMin ?? 0)}
                </div>
              ) : (
                <div className="text-xs text-muted-foreground">
                  Через: {formatMinutes(e.startsInMin ?? 0)}
                </div>
              )}
            </CardContent>
          </div>
          {bossImages[e.boss] && (
            <Image
              src={bossImages[e.boss]}
              alt={e.boss}
              width={80}
              height={80}
              className="mr-6 shrink-0 rounded-lg object-cover"
            />
          )}
        </Card>
      ))}
    </div>
  );
}
