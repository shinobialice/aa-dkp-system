"use client";

import type { ReactNode } from "react";
import { Clock, Moon } from "lucide-react";
import { useClock } from "@/hooks/useClock";
import {
  formatGameTime,
  formatMoscowTime,
} from "@/widgets/PromoQuests/gameClock";

const TICK_MS = 1000;
const EMPTY_TIME = "--:--";

export default function HeaderClocks() {
  const now = useClock(TICK_MS);
  const moscowTime = now === null ? EMPTY_TIME : formatMoscowTime(now);
  const gameTime = now === null ? EMPTY_TIME : formatGameTime(now);

  return (
    <div className="flex h-9 shrink-0 items-center rounded-full border bg-muted/50 text-sm">
      <ClockPart icon={<Clock />} label="Москва" time={moscowTime} />
      <span className="h-4 w-px bg-border" />
      <ClockPart icon={<Moon />} label="Архейдж" time={gameTime} />
    </div>
  );
}

function ClockPart({
  icon,
  label,
  time,
}: {
  icon: ReactNode;
  label: string;
  time: string;
}) {
  return (
    <span
      title={label}
      className="flex items-center gap-1.5 px-3 [&_svg]:size-3.5 [&_svg]:text-muted-foreground"
    >
      {icon}
      <span className="hidden text-xs text-muted-foreground lg:inline">
        {label}
      </span>
      <span className="font-semibold tabular-nums">{time}</span>
    </span>
  );
}
