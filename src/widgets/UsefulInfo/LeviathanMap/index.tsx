"use client";

import Image from "next/image";
import { useClock } from "@/hooks/useClock";
import { BOSS_ICON, toMapPercent } from "../spawnScheduleModel";
import LeviathanStatus from "./LeviathanStatus";
import {
  getLeviathanState,
  LEVIATHAN_MAP,
  LEVIATHAN_SCHEDULE_TEXT,
  ROUTE,
} from "./leviathanModel";
const ROUTE_POINTS = ROUTE.map(([x, y]) => `${x},${y}`).join(" ");
const [START_X, START_Y] = ROUTE[0];

export default function LeviathanMap() {
  const now = useClock(1000);
  const state = now === null ? null : getLeviathanState(now);
  const position = state?.phase === "swimming" ? state.position : null;

  return (
    <section
      aria-label="Маршрут Левиафана"
      className="flex flex-col gap-3 rounded-xl border bg-card p-4 sm:p-4.5"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h2 className="text-base font-semibold">Маршрут Левиафана</h2>
        <span className="text-sm text-muted-foreground">
          {LEVIATHAN_SCHEDULE_TEXT}
        </span>
      </div>

      <LeviathanStatus state={state} now={now} />

      <div className="relative w-fit max-w-full overflow-hidden rounded-lg border">
        <Image
          src={LEVIATHAN_MAP.src}
          alt="Восток Безмятежного моря, маршрут Левиафана"
          width={LEVIATHAN_MAP.width}
          height={LEVIATHAN_MAP.height}
          sizes={`(min-width: ${LEVIATHAN_MAP.width + 40}px) ${LEVIATHAN_MAP.width}px, 100vw`}
          className="h-auto max-w-full"
        />
        <svg
          aria-hidden
          viewBox={`0 0 ${LEVIATHAN_MAP.width} ${LEVIATHAN_MAP.height}`}
          className="pointer-events-none absolute inset-0 size-full"
        >
          <defs>
            <marker
              id="leviathan-route-arrow"
              viewBox="0 0 10 10"
              refX="5"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto"
            >
              <path d="M0,0 L10,5 L0,10 z" fill="#b45309" />
            </marker>
          </defs>
          <polygon
            points={ROUTE_POINTS}
            fill="none"
            stroke="#b45309"
            strokeWidth="3"
            strokeDasharray="10 6"
            markerMid="url(#leviathan-route-arrow)"
          />
          <circle
            cx={START_X}
            cy={START_Y}
            r="9"
            fill="#f59e0b"
            stroke="white"
            strokeWidth="3"
          />
        </svg>
        {position && (
          <Image
            src={BOSS_ICON}
            alt="Левиафан"
            width={36}
            height={39}
            unoptimized
            style={toMapPercent([position.x, position.y], LEVIATHAN_MAP)}
            className="absolute -translate-x-1/2 -translate-y-1/2 drop-shadow-[0_1px_2px_rgb(0_0_0/0.6)] transition-[left,top] duration-1000 ease-linear"
          />
        )}
      </div>

      <p className="text-xs text-muted-foreground">
        Жёлтая точка — место появления в 20:30 МСК, стрелки показывают
        направление. Положение на карте рассчитано по времени: скорость около 67
        км/ч, один круг ≈ 24 минуты, прогноз показывается 2 часа после выхода.
        Если Левиафана уже убили или он задержался, метка об этом не знает.
      </p>
    </section>
  );
}
