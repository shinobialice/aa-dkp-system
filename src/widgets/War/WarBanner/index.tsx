"use client";

import type { ReactNode } from "react";
import { useClock } from "@/hooks/useClock";
import {
  FACTION_LABEL,
  MODE_LABEL,
  type GuildFaction,
  type GuildMode,
} from "@/shared/config/guildStatus";
import { cn } from "@/shared/lib/tw-merge";
import SkewTag from "@/widgets/arena/SkewTag";
import type { OpponentView } from "../opponentsModel";
import { formatDayMonth } from "../warModel";
import BannerClock from "./BannerClock";
import { statusLabel, statusTone } from "./bannerModel";
import FoeList from "./FoeList";
import FreeshardSide from "./FreeshardSide";
import UsSide from "./UsSide";

const SECOND_MS = 1000;

type Props = {
  mode: GuildMode;
  server: string;
  faction: GuildFaction;
  startedAt: string | null;
  endedAt: string | null;
  opponents: OpponentView[];
  tabs?: ReactNode;
  action?: ReactNode;
};

export default function WarBanner({
  mode,
  server,
  faction,
  startedAt,
  endedAt,
  opponents,
  tabs,
  action,
}: Props) {
  const now = useClock(SECOND_MS);
  const isLive = endedAt === null;
  const since = startedAt ? ` · с ${formatDayMonth(startedAt, true)}` : "";

  return (
    <section
      aria-label={MODE_LABEL[mode]}
      className={cn(
        "arena-banner arena-seam",
        mode === "pvp" ? "arena-versus" : "arena-versus-free",
      )}
    >
      <div className="relative z-[2] flex flex-wrap items-center gap-x-3.5 gap-y-2.5 px-5 pt-5 md:px-8 md:pt-6">
        <SkewTag className={statusTone(mode, isLive)}>
          {isLive && (
            <span className="arena-blink size-1.5 rounded-full bg-current" />
          )}
          {statusLabel(mode, isLive)}
        </SkewTag>
        <span className="text-sm text-white/70">
          {server} · {FACTION_LABEL[faction]}
          {since}
        </span>
        {action}
        {tabs && <div className="w-full sm:ml-auto sm:w-auto">{tabs}</div>}
      </div>
      <div className="relative z-[2] grid items-center gap-4 px-5 py-6 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:gap-6 md:px-10 md:pt-7 md:pb-9">
        <UsSide />
        <BannerClock
          mode={mode}
          startedAt={startedAt}
          endedAt={endedAt}
          now={now}
        />
        <OpponentSide
          mode={mode}
          faction={faction}
          opponents={opponents}
          now={now}
        />
      </div>
    </section>
  );
}

type OpponentSideProps = {
  mode: GuildMode;
  faction: GuildFaction;
  opponents: OpponentView[];
  now: number | null;
};

function OpponentSide({ mode, faction, opponents, now }: OpponentSideProps) {
  if (mode === "freeshard") return <FreeshardSide faction={faction} />;
  return <FoeList opponents={opponents} now={now} />;
}
