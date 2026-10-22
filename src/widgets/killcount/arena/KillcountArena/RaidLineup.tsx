import type { ArenaRaid } from "@/server/killcountArena/types";
import { cn } from "@/shared/lib/tw-merge";
import type { ArenaKind } from "./killcountArenaModel";

type Props = {
  raids: ArenaRaid[];
  kind: ArenaKind;
};

export default function RaidLineup({ raids, kind }: Props) {
  return (
    <div className="relative z-[2] flex items-center gap-2 overflow-x-auto px-5 pt-1 pb-8 [scrollbar-width:none] md:px-9">
      <span className="mr-1.5 shrink-0 font-display text-xs tracking-widest text-white/60 uppercase">
        {kind === "prime" ? "Рейды" : "Рейд"}
      </span>
      {raids.length === 0 && (
        <span className="shrink-0 -skew-x-12 border border-dashed border-white/30 px-3 py-1.5 text-xs text-white/70">
          <span className="inline-block skew-x-12">
            посещение ещё не заполнено
          </span>
        </span>
      )}
      {raids.map((raid) => (
        <span
          key={raid.id}
          className={cn(
            "shrink-0 -skew-x-12 border bg-white/7",
            raid.isLinked
              ? "border-green-400/60"
              : "border-white/15 opacity-70",
          )}
        >
          <span className="flex skew-x-12 items-center gap-2.5 py-1.5 pr-3.5 pl-2 whitespace-nowrap">
            <span className="font-display text-sm text-green-400">
              {raid.time}
            </span>
            <span className="text-[13px] leading-tight font-semibold">
              {raid.boss}
              <span className="block text-2xs font-medium text-white/60">
                {raid.people} чел. в посещении
              </span>
            </span>
          </span>
        </span>
      ))}
    </div>
  );
}
