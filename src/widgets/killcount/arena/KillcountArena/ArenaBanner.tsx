import Link from "next/link";
import { Radar } from "lucide-react";
import type { ArenaKillcount } from "@/server/killcountArena/types";
import { formatNumber } from "@/shared/lib/format";
import { cn } from "@/shared/lib/tw-merge";
import SkewTag from "@/widgets/arena/SkewTag";
import { longDate } from "../../ui/killcountModel";
import TopThree from "./TopThree";
import RaidLineup from "./RaidLineup";
import {
  arenaHref,
  fightersText,
  KIND_LABEL,
  killsWord,
  sortFighters,
  timeOf,
  totalHonor,
  totalKills,
  weekdayLong,
  windowText,
  type ArenaKind,
} from "./killcountArenaModel";

type Props = {
  killcount: ArenaKillcount;
  prevHref: string | null;
  nextHref: string | null;
  counts: Record<ArenaKind, number>;
};

export default function ArenaBanner({
  killcount,
  prevHref,
  nextHref,
  counts,
}: Props) {
  const { kind, day, window, fighters, raids } = killcount;
  const sorted = sortFighters(fighters, "kills");
  const kills = totalKills(fighters);
  const title =
    kind === "agl" && window
      ? `${longDate(day)}, ${timeOf(window.startedAt)}`
      : longDate(day);

  return (
    <section
      aria-label="Киллкаунт"
      className="arena-banner arena-poster flex flex-col"
    >
      <p
        aria-hidden
        className="arena-ghost pointer-events-none absolute -right-[2%] -bottom-[16%] -z-10 -skew-x-8 font-display text-[clamp(120px,19vw,230px)] leading-none whitespace-nowrap uppercase"
      >
        {KIND_LABEL[kind]}
      </p>
      <div className="relative z-[2] flex flex-wrap items-center gap-x-3.5 gap-y-2.5 px-5 pt-5 md:px-8">
        <SkewTag className="bg-green-500 text-green-950">
          {KIND_LABEL[kind]}
        </SkewTag>
        <span className="text-sm text-white/70">
          {weekdayLong(day)}
          {kind === "agl" && " · не идёт в звания"}
        </span>
        <NavLinks prevHref={prevHref} nextHref={nextHref} />
        <KindTabs active={kind} counts={counts} />
      </div>
      <div className="relative z-[2] grid items-center gap-5 px-5 py-5 md:grid-cols-[minmax(0,1fr)_auto] md:gap-8 md:px-9 md:pt-6">
        <div className="min-w-0">
          <h1 className="-skew-x-8 font-display text-[clamp(38px,6.4vw,72px)] leading-[0.95] break-words uppercase [text-shadow:0_5px_0_rgb(0_0_0/0.28)]">
            {title}
          </h1>
          <p className="mt-3 flex flex-wrap items-baseline gap-x-3.5 gap-y-1">
            <span className="font-display text-[clamp(36px,5vw,56px)] leading-[1.05] text-green-400 tabular-nums">
              {formatNumber(kills)}
            </span>
            <span className="text-sm text-white/70">
              {killsWord(kills)} · {formatNumber(totalHonor(fighters))} хонора ·{" "}
              {fightersText(fighters.length)}
            </span>
          </p>
          <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/80">
            <Radar className="size-4 shrink-0 text-green-400" />
            {window
              ? windowText(window)
              : "добавлен вручную, время не записано"}
          </p>
        </div>
        {sorted.length > 0 && <TopThree fighters={sorted} />}
      </div>
      <RaidLineup raids={raids} kind={kind} />
    </section>
  );
}

function NavLinks({
  prevHref,
  nextHref,
}: {
  prevHref: string | null;
  nextHref: string | null;
}) {
  return (
    <span className="inline-flex gap-1">
      <NavLink href={prevHref} label="Раньше">
        ‹
      </NavLink>
      <NavLink href={nextHref} label="Позже">
        ›
      </NavLink>
    </span>
  );
}

function NavLink({
  href,
  label,
  children,
}: {
  href: string | null;
  label: string;
  children: string;
}) {
  const className =
    "arena-skew inline-flex h-8 w-9 items-center justify-center bg-white/10 text-lg leading-none text-white";
  if (!href) {
    return (
      <span aria-hidden className={cn(className, "opacity-30")}>
        {children}
      </span>
    );
  }
  return (
    <Link
      href={href}
      aria-label={label}
      className={cn(className, "hover:bg-white/20")}
    >
      {children}
    </Link>
  );
}

function KindTabs({
  active,
  counts,
}: {
  active: ArenaKind;
  counts: Record<ArenaKind, number>;
}) {
  const kinds: ArenaKind[] = ["prime", "agl"];
  return (
    <nav
      aria-label="Тип киллкаунта"
      className="flex w-full gap-1 sm:ml-auto sm:w-auto"
    >
      {kinds.map((kind) => (
        <Link
          key={kind}
          href={arenaHref(kind, null)}
          aria-current={kind === active ? "page" : undefined}
          className={cn(
            "arena-skew flex h-8 flex-1 items-center justify-center gap-1.5 px-3.5 font-display text-xs tracking-wide uppercase transition-colors sm:flex-none",
            kind === active
              ? "bg-white text-[#0b1a12]"
              : "bg-white/10 text-white/80 hover:bg-white/20",
          )}
        >
          {kind === "prime" ? "Праймы" : "АГЛ"}
          <span className="opacity-60">{counts[kind]}</span>
        </Link>
      ))}
    </nav>
  );
}
