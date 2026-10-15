"use client";

import { useClock } from "@/hooks/useClock";
import { useUpcomingEvents } from "@/hooks/useUpcomingEvents";
import { bossImages } from "@/shared/config/bossImages";
import { getMoscowTime } from "@/shared/config/fixedSchedule";
import type { UpcomingEvent } from "@/shared/lib/upcomingEvents";
import { cn } from "@/shared/lib/tw-merge";
import RollingDigits from "@/widgets/arena/RollingDigits";
import ShieldImage from "@/widgets/arena/ShieldImage";
import SkewTag from "@/widgets/arena/SkewTag";
import SoundNotificationToggle from "../SoundNotificationToggle";
import PosterLineup from "./PosterLineup";
import {
  currentLabel,
  dayLabel,
  formatCountdown,
  planPoster,
  secondsUntil,
  titleSizeClass,
} from "./posterModel";

const SECOND_MS = 1000;

export default function NextFightPoster() {
  const events = useUpcomingEvents();
  const now = useClock(SECOND_MS);
  const { main, current, lineup } = planPoster(events);
  const today = now === null ? null : getMoscowTime(new Date(now));

  return (
    <section
      aria-label="Следующий выход"
      className="arena-banner arena-poster arena-sweep grid min-h-56 md:grid-cols-[minmax(0,1fr)_auto]"
    >
      {main && (
        <p
          aria-hidden
          className="arena-ghost pointer-events-none absolute -right-[2%] -bottom-[18%] -z-10 -skew-x-8 font-display text-[clamp(120px,20vw,240px)] leading-none whitespace-nowrap uppercase"
        >
          {main.boss}
        </p>
      )}
      <div className="flex min-w-0 flex-col gap-2.5 px-5 pt-6 pr-32 pb-4 md:px-9 md:pt-8">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-white/75">
          <SkewTag className="bg-green-500 text-green-950">
            Следующий выход
          </SkewTag>
          {main && today && (
            <span>
              {dayLabel(main.date, today)}, {main.time}
            </span>
          )}
        </div>
        <PosterMain main={main} now={now} />
        {current.length > 0 && (
          <p className="flex items-center gap-2 text-sm text-white/85">
            <span className="arena-blink size-2 shrink-0 rounded-full bg-green-400" />
            Сейчас идёт: {currentLabel(current)}
          </p>
        )}
        <SoundNotificationToggle />
      </div>
      {main && <PosterArt key={main.key} boss={main.boss} />}
      {today && <PosterLineup events={lineup} today={today} />}
    </section>
  );
}

function PosterMain({
  main,
  now,
}: {
  main: UpcomingEvent | null;
  now: number | null;
}) {
  if (!main) {
    return (
      <p className="py-6 text-lg text-white/80">Событий на неделю вперёд нет</p>
    );
  }
  return (
    <>
      <h1
        key={main.key}
        className={cn(
          "arena-slam -skew-x-8 font-display leading-[0.92] break-words uppercase [text-shadow:0_5px_0_rgb(0_0_0/0.28)]",
          titleSizeClass(main.boss),
        )}
      >
        {main.boss}
      </h1>
      {now !== null && (
        <p className="flex flex-wrap items-baseline gap-x-3.5">
          <RollingDigits
            text={formatCountdown(secondsUntil(main, now))}
            className="font-display text-[clamp(34px,5vw,48px)] leading-[1.1] text-green-400"
          />
          <span className="text-sm text-white/70">до начала</span>
        </p>
      )}
    </>
  );
}

function PosterArt({ boss }: { boss: string }) {
  const src = bossImages[boss];
  if (!src) return null;
  return (
    <div className="arena-from-right absolute top-5 -right-3 -z-10 opacity-85 md:relative md:top-auto md:right-auto md:z-auto md:mt-7 md:mr-9 md:self-end md:opacity-100">
      <ShieldImage
        src={src}
        alt={boss}
        sizes="(min-width: 768px) 236px, 128px"
        className="h-[146px] w-[128px] md:h-[268px] md:w-[236px]"
      />
      <span
        aria-hidden
        className="absolute top-8 -left-7 hidden -rotate-6 -skew-x-12 bg-green-500 px-2.5 py-1 font-display text-2xl text-green-950 shadow-lg md:block"
      >
        VS
      </span>
    </div>
  );
}
