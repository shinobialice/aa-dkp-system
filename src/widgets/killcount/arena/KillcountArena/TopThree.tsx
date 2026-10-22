import type { ArenaFighter } from "@/server/killcountArena/types";
import { avatarSrc } from "@/shared/lib/format";
import { cn } from "@/shared/lib/tw-merge";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui";
import { kills } from "../../ui/killcountModel";
import { killsText } from "./killcountArenaModel";

type Props = {
  fighters: ArenaFighter[];
};

type Podium = {
  place: number;
  rim: string;
  tag: string;
  shield: string;
  column: string;
  name: string;
};

const PODIUM: Podium[] = [
  {
    place: 2,
    rim: "arena-rim",
    tag: "bg-[#aab3c5] text-[#1b1f2a]",
    shield: "h-[92px] w-[80px] md:h-[126px] md:w-[110px]",
    column: "w-[84px] md:w-[124px]",
    name: "text-xs md:text-sm",
  },
  {
    place: 1,
    rim: "arena-rim-gold",
    tag: "bg-green-500 text-green-950",
    shield: "h-[122px] w-[106px] md:h-[172px] md:w-[150px]",
    column: "w-[112px] md:w-[164px]",
    name: "text-sm md:text-base",
  },
  {
    place: 3,
    rim: "arena-rim-bronze",
    tag: "bg-[#c98552] text-[#2a1507]",
    shield: "h-[92px] w-[80px] md:h-[126px] md:w-[110px]",
    column: "w-[84px] md:w-[124px]",
    name: "text-xs md:text-sm",
  },
];

export default function TopThree({ fighters }: Props) {
  return (
    <ol
      aria-label="Топ-3"
      className="flex items-end justify-center gap-2.5 md:gap-4"
    >
      {PODIUM.map((spot) => {
        const fighter = fighters[spot.place - 1];
        if (!fighter) return null;
        return (
          <li
            key={fighter.id}
            className={cn("flex flex-col items-center gap-1.5", spot.column)}
          >
            <div className={cn("relative shrink-0", spot.shield)}>
              <div className={cn("arena-shield absolute inset-0", spot.rim)} />
              <div className="arena-shield absolute inset-1 overflow-hidden bg-[radial-gradient(circle_at_50%_35%,#1f7a4a,#08160f)]">
                <Avatar className="size-full rounded-none">
                  <AvatarImage
                    src={avatarSrc(fighter.userName, fighter.avatarUrl)}
                    alt=""
                    className="object-cover"
                  />
                  <AvatarFallback className="rounded-none bg-transparent font-display text-2xl text-white/70">
                    {fighter.userName.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <span
                aria-hidden
                className={cn(
                  "absolute top-2 -left-3 -rotate-6 -skew-x-12 px-2 py-0.5 font-display shadow-lg",
                  spot.place === 1
                    ? "text-sm md:text-lg"
                    : "text-xs md:text-sm",
                  spot.tag,
                )}
              >
                №{spot.place}
              </span>
            </div>
            <p
              className={cn(
                "max-w-full truncate text-center font-display uppercase [text-shadow:0_3px_0_rgb(0_0_0/0.3)]",
                spot.name,
              )}
            >
              {fighter.userName}
            </p>
            <p className="-mt-1 text-2xs whitespace-nowrap text-white/70">
              {killsText(kills(fighter))}
            </p>
          </li>
        );
      })}
    </ol>
  );
}
