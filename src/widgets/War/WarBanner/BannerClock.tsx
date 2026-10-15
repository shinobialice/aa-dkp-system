"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { MODE_ICON, type GuildMode } from "@/shared/config/guildStatus";
import { burstSparks } from "@/shared/lib/sparks";
import { formatSpan } from "../warModel";
import { CLOCK_LABEL, liveClock } from "./bannerModel";

const SPARK_DELAY_MS = 1000;
const SPARK_COLORS = ["#ffffff", "#ffd27a", "#ff7a7a", "#4ade80"];

type Props = {
  mode: GuildMode;
  startedAt: string | null;
  endedAt: string | null;
  now: number | null;
};

export default function BannerClock({ mode, startedAt, endedAt, now }: Props) {
  const iconRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (iconRef.current) burstSparks(iconRef.current, SPARK_COLORS);
    }, SPARK_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex items-center gap-3.5 md:flex-col md:gap-1.5 md:text-center">
      <Image
        ref={iconRef}
        src={MODE_ICON[mode]}
        alt=""
        width={96}
        height={96}
        className="arena-clang size-13 object-contain drop-shadow-[0_0_18px_rgb(255_120_120/0.5)] md:size-24"
      />
      <div className="bg-black/40 px-3 py-1.5 backdrop-blur-sm">
        <ClockValue startedAt={startedAt} endedAt={endedAt} now={now} />
        <p className="text-2xs tracking-[0.12em] text-white/60 uppercase">
          {endedAt ? "длительность" : CLOCK_LABEL[mode]}
        </p>
      </div>
    </div>
  );
}

function ClockValue({
  startedAt,
  endedAt,
  now,
}: {
  startedAt: string | null;
  endedAt: string | null;
  now: number | null;
}) {
  const className =
    "font-display text-[clamp(20px,2.6vw,28px)] leading-none whitespace-nowrap";
  if (!startedAt) return <p className={className}>—</p>;
  if (endedAt) {
    return (
      <p className={className}>
        {formatSpan(startedAt, new Date(endedAt).getTime())}
      </p>
    );
  }
  if (now === null) return <p className={className}>…</p>;
  const clock = liveClock(startedAt, now);
  return (
    <p className={className}>
      {clock.days}{" "}
      <span className="text-[0.6em] text-white/70">{clock.time}</span>
    </p>
  );
}
