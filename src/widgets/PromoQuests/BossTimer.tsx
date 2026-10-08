"use client";

import { Timer } from "lucide-react";
import { useClock } from "@/hooks/useClock";
import {
  formatCountdown,
  formatGameHour,
  formatMoscowTime,
  nextBossSpawn,
} from "./gameClock";

const TICK_MS = 15_000;

type Props = {
  gameHour: number;
};

export default function BossTimer({ gameHour }: Props) {
  const now = useClock(TICK_MS);
  if (now === null) return null;

  const spawn = nextBossSpawn(now, gameHour);

  return (
    <div
      className="flex items-center gap-1 text-xs font-medium text-amber-700 dark:text-amber-400"
      title={`Появляется в ${formatGameHour(gameHour)} по игровому времени`}
    >
      <Timer className="size-3.5 shrink-0" />
      Через {formatCountdown(spawn.inMinutes)}, в {formatMoscowTime(spawn.at)}{" "}
      МСК
    </div>
  );
}
