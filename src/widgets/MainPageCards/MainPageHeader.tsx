"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Clock, Moon } from "lucide-react";
import { getMoscowTime } from "@/shared/config/fixedSchedule";

function getStartOfGameDay(now: Date): Date {
  const start = new Date(now);
  start.setHours(6, 20, 0, 0);
  if (now < start) {
    start.setDate(start.getDate() - 1);
  }
  return start;
}

function pad(value: number) {
  return value.toString().padStart(2, "0");
}

function getGameTime(now: Date) {
  const diffMs = now.getTime() - getStartOfGameDay(now).getTime();
  const totalGameSeconds = Math.floor(diffMs / 1000) * 6;
  const hours = Math.floor(totalGameSeconds / 3600) % 24;
  const minutes = Math.floor((totalGameSeconds % 3600) / 60);
  return `${pad(hours)}:${pad(minutes)}:${pad(totalGameSeconds % 60)}`;
}

function ClockPill({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex h-9 items-center gap-2 rounded-lg border bg-card px-3 shadow-xs">
      <span className="text-muted-foreground">{icon}</span>
      <span className="text-xs text-muted-foreground">{label}</span>
      <span className="font-semibold tabular-nums">{value}</span>
    </div>
  );
}

export default function MainPageHeader() {
  const [now, setNow] = useState(getMoscowTime);

  useEffect(() => {
    const interval = setInterval(() => setNow(getMoscowTime()), 1000);
    return () => clearInterval(interval);
  }, []);

  const date = now.toLocaleDateString("ru-RU", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <h1 className="text-2xl font-bold tracking-tight">
        {date.charAt(0).toUpperCase() + date.slice(1)}
      </h1>
      <div className="flex flex-wrap items-center gap-2 md:hidden">
        <ClockPill
          icon={<Clock className="size-4" />}
          label="Москва"
          value={now.toLocaleTimeString("ru-RU", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}
        />
        <ClockPill
          icon={<Moon className="size-4" />}
          label="Архейдж"
          value={getGameTime(now)}
        />
      </div>
    </div>
  );
}
