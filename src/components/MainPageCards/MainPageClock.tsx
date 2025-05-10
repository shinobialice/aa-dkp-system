"use client";

import { useEffect, useState } from "react";

function getStartOfGameDay(now: Date): Date {
  const start = new Date(now);
  start.setHours(6, 20, 0, 0);
  if (now < start) {
    start.setDate(start.getDate() - 1);
  }
  return start;
}

function formatTime(h: number, m: number, s: number): string {
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s
    .toString()
    .padStart(2, "0")}`;
}

function getMoscowTime(): Date {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + 3 * 60 * 60 * 1000);
}

export default function MainPageClock() {
  const [realTime, setRealTime] = useState(getMoscowTime());
  const [gameTime, setGameTime] = useState("00:00:00");

  useEffect(() => {
    const interval = setInterval(() => {
      const now = getMoscowTime();
      setRealTime(now);

      const start = getStartOfGameDay(now);
      const diffMs = now.getTime() - start.getTime();

      const totalGameSeconds = Math.floor(diffMs / 1000) * 6;
      const hours = Math.floor(totalGameSeconds / 3600) % 24;
      const minutes = Math.floor((totalGameSeconds % 3600) / 60);
      const seconds = totalGameSeconds % 60;

      setGameTime(formatTime(hours, minutes, seconds));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-row justify-between items-center gap-4 text-sm font-mono">
      <div>
        🕓 МСК:{" "}
        {realTime.toLocaleTimeString("ru-RU", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })}
      </div>
      <div>🕘 Архейдж: {gameTime}</div>
    </div>
  );
}
