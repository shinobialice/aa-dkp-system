"use client";

import Image from "next/image";
import { useClock } from "@/hooks/useClock";
import {
  BOSS_ICON,
  formatDuration,
  formatSpawnDate,
  toMapPercent,
} from "../spawnScheduleModel";
import {
  getKrakenState,
  KRAKEN_MAP,
  KRAKEN_SCHEDULE_TEXT,
  KRAKEN_SPAWNS,
  type KrakenState,
} from "./krakenModel";

export default function KrakenMap() {
  const now = useClock(1000);
  const state = now === null ? null : getKrakenState(now);

  return (
    <section
      aria-label="Места появления Кракена"
      className="flex flex-col gap-3 rounded-xl border bg-card p-4 sm:p-4.5"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
        <h2 className="text-base font-semibold">Места появления Кракена</h2>
        <span className="text-sm text-muted-foreground">
          {KRAKEN_SCHEDULE_TEXT}
        </span>
      </div>

      <KrakenStatus state={state} now={now} />

      <div className="relative mx-auto w-fit max-w-full overflow-hidden rounded-lg border">
        <Image
          src={KRAKEN_MAP.src}
          alt="Юго-запад Безмятежного моря, места появления Кракена"
          width={KRAKEN_MAP.width}
          height={KRAKEN_MAP.height}
          sizes={`(min-width: ${KRAKEN_MAP.width + 40}px) ${KRAKEN_MAP.width}px, 100vw`}
          className="h-auto max-w-full"
        />
        {KRAKEN_SPAWNS.map(({ label, point }) => (
          <span
            key={label}
            style={toMapPercent(point, KRAKEN_MAP)}
            className="absolute flex -translate-x-1/2 -translate-y-5 flex-col items-center"
          >
            <Image
              src={BOSS_ICON}
              alt={`Кракен, ${label.toLowerCase()}`}
              width={36}
              height={39}
              unoptimized
              className="drop-shadow-[0_1px_2px_rgb(0_0_0/0.6)]"
            />
            <span className="rounded bg-black/60 px-1.5 text-xs font-medium text-white">
              {label}
            </span>
          </span>
        ))}
      </div>

      <p className="text-xs text-muted-foreground">
        Отмечены две точки, где появляется Кракен. Положение меток примерное.
      </p>
    </section>
  );
}

function KrakenStatus({
  state,
  now,
}: {
  state: KrakenState | null;
  now: number | null;
}) {
  if (state === null || now === null) {
    return <div className="h-11" aria-hidden />;
  }

  if (state.phase === "spawned") {
    return (
      <div className="flex flex-col gap-0.5 text-sm">
        <span className="font-medium text-amber-700 dark:text-amber-400">
          Кракен появился по расписанию
        </span>
        <span className="text-muted-foreground">
          {formatDuration(state.sinceSpawnMs)} назад
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-0.5 text-sm">
      <span className="font-medium">
        Следующий выход: {formatSpawnDate(state.nextSpawnAt)}
      </span>
      <span className="text-muted-foreground">
        через {formatDuration(state.nextSpawnAt - now)}
      </span>
    </div>
  );
}
