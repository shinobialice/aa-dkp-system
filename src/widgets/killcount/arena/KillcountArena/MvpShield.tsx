import type { ArenaFighter } from "@/server/killcountArena/types";
import { avatarSrc } from "@/shared/lib/format";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui";
import { kills } from "../../ui/killcountModel";
import { killsText, placeTone } from "./killcountArenaModel";

type Props = {
  fighters: ArenaFighter[];
};

export default function MvpShield({ fighters }: Props) {
  const [mvp, ...rest] = fighters;
  return (
    <div className="flex items-center gap-4 md:flex-col md:gap-2">
      <div className="relative h-[106px] w-[92px] shrink-0 md:h-[194px] md:w-[170px]">
        <div className="arena-shield arena-rim-gold absolute inset-0" />
        <div className="arena-shield absolute inset-1 overflow-hidden bg-[radial-gradient(circle_at_50%_35%,#1f7a4a,#08160f)]">
          <Avatar className="size-full rounded-none">
            <AvatarImage
              src={avatarSrc(mvp.userName, mvp.avatarUrl)}
              alt=""
              className="object-cover"
            />
            <AvatarFallback className="rounded-none bg-transparent font-display text-3xl text-white/70">
              {mvp.userName.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
        </div>
        <span
          aria-hidden
          className="absolute top-3 -left-3 -rotate-6 -skew-x-12 bg-green-500 px-2 py-0.5 font-display text-sm text-green-950 shadow-lg md:top-6 md:-left-7 md:px-2.5 md:py-1 md:text-xl"
        >
          №1
        </span>
      </div>
      <div className="min-w-0 md:text-center">
        <p className="truncate font-display text-base uppercase [text-shadow:0_3px_0_rgb(0_0_0/0.3)] md:max-w-56">
          {mvp.userName}
        </p>
        <p className="text-xs text-white/70">
          {killsText(kills(mvp))}
          {mvp.playerClass && ` · ${mvp.playerClass}`}
        </p>
      </div>
      {rest.length > 0 && (
        <ol className="hidden gap-1.5 md:flex">
          {rest.slice(0, 2).map((fighter, index) => (
            <li
              key={fighter.id}
              className="-skew-x-12 border border-white/15 bg-white/7"
            >
              <span className="flex skew-x-12 items-center gap-2 px-3 py-1 text-xs whitespace-nowrap">
                <span className={`font-display ${placeTone(index + 2)}`}>
                  {index + 2}
                </span>
                <span className="max-w-28 truncate font-semibold">
                  {fighter.userName}
                </span>
                <span className="font-display text-green-400">
                  {kills(fighter)}
                </span>
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
