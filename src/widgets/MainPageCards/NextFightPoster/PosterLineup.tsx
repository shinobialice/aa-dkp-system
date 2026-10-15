import Image from "next/image";
import { bossImages } from "@/shared/config/bossImages";
import type { UpcomingEvent } from "@/shared/lib/upcomingEvents";
import { cn } from "@/shared/lib/tw-merge";
import { isRespawnEvent, lineupNote } from "./posterModel";

const FIRST_DELAY_S = 0.6;
const STEP_DELAY_S = 0.07;

type Props = {
  events: UpcomingEvent[];
  today: Date;
};

export default function PosterLineup({ events, today }: Props) {
  if (events.length === 0) return null;

  return (
    <div className="flex items-center gap-2 overflow-x-auto px-5 pt-1.5 pb-6 [scrollbar-width:none] md:col-span-2 md:px-9 md:pb-7">
      <span className="mr-1.5 shrink-0 font-display text-xs tracking-widest text-white/60 uppercase">
        Дальше
      </span>
      <ol aria-label="Дальше" className="flex gap-2">
        {events.map((event, index) => (
          <li
            key={event.key}
            className={cn(
              "arena-enter shrink-0 -skew-x-12 border bg-white/7 transition-colors hover:bg-white/14",
              isRespawnEvent(event) ? "border-green-400/60" : "border-white/15",
            )}
            style={{
              animationDelay: `${FIRST_DELAY_S + index * STEP_DELAY_S}s`,
            }}
          >
            <div className="flex skew-x-12 items-center gap-2.5 py-1.5 pr-3.5 pl-2 whitespace-nowrap">
              <span className="font-display text-sm text-green-400">
                {event.time}
              </span>
              {bossImages[event.boss] && (
                <Image
                  src={bossImages[event.boss]}
                  alt=""
                  width={26}
                  height={26}
                  className="size-6.5 rounded-full object-cover"
                />
              )}
              <span className="text-[13px] leading-tight font-semibold">
                {event.boss}
                <span className="block text-2xs font-medium text-white/60">
                  {lineupNote(event, today)}
                </span>
              </span>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
