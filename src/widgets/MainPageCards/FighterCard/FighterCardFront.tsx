import { Flame } from "lucide-react";
import type { MyFighterCard } from "@/actions/getMyFighterCard";
import { avatarSrc } from "@/shared/lib/format";
import { Avatar, AvatarFallback, AvatarFrame, AvatarImage } from "@/shared/ui";
import SkewTag from "@/widgets/arena/SkewTag";
import { frontStats, gearScoreText, streakLabel } from "./fighterCardModel";

type Props = {
  card: MyFighterCard;
  now: number | null;
};

export default function FighterCardFront({ card, now }: Props) {
  return (
    <div className="arena-card-face arena-card-shape arena-rim absolute inset-0">
      <div className="arena-card-shape arena-card-body absolute inset-1 overflow-hidden text-white">
        <div
          aria-hidden
          className="arena-rays absolute top-[33%] left-1/2 aspect-square w-[170%] -translate-x-1/2 -translate-y-1/2"
        />
        <div className="absolute inset-x-[18px] top-4 z-[3] flex items-start justify-between">
          <span className="flex flex-col items-start">
            <span className="font-display text-[26px] leading-none [text-shadow:0_2px_0_rgb(0_0_0/0.3)]">
              {gearScoreText(card.gearScore)}
            </span>
            <span className="mt-1 text-[11px] tracking-widest text-green-300">
              Гир-скор
            </span>
            {card.className && (
              <SkewTag className="mt-1.5 bg-green-500 text-green-950">
                {card.className}
              </SkewTag>
            )}
          </span>
          <span className="flex flex-col items-center font-display text-xl leading-none">
            <Flame className="arena-float size-5.5 fill-orange-400 text-orange-400 drop-shadow-[0_0_6px_rgb(255_140_50/0.7)]" />
            {card.streak.streak}
            <span className="mt-0.5 font-sans text-[10px] tracking-wider text-white/70">
              {streakLabel(card.streak.streak)}
            </span>
          </span>
        </div>
        <div className="absolute top-[17%] left-1/2 z-[2] w-[42%] -translate-x-1/2">
          <AvatarFrame
            frameUrl={card.frameUrl}
            className="aspect-square w-full"
          >
            <Avatar className="size-full shadow-[0_12px_26px_-8px_rgb(0_0_0/0.7)]">
              <AvatarImage
                src={avatarSrc(card.username, card.avatarUrl)}
                alt=""
              />
              <AvatarFallback className="bg-green-900 font-display text-2xl">
                {card.username.slice(0, 1)}
              </AvatarFallback>
            </Avatar>
          </AvatarFrame>
        </div>
        <span className="absolute inset-x-2 top-[59%] z-[3] truncate text-center font-display text-xl tracking-wide uppercase [text-shadow:0_2px_0_rgb(0_0_0/0.35)]">
          {card.username}
        </span>
        <span className="absolute top-[66.5%] left-1/2 z-[3] h-px w-[62%] -translate-x-1/2 bg-gradient-to-r from-transparent via-green-400 to-transparent" />
        <span className="absolute inset-x-5 top-[69.5%] z-[3] grid grid-cols-3 gap-x-1 gap-y-1.5 text-center">
          {frontStats(card, now).map((stat) => (
            <span key={stat.label} className="flex flex-col">
              <span className="font-display text-[17px] leading-tight">
                {stat.value}
              </span>
              <span className="text-[9.5px] tracking-widest text-white/60 uppercase">
                {stat.label}
              </span>
            </span>
          ))}
        </span>
        <span className="absolute inset-x-0 bottom-[4.5%] z-[3] text-center font-display text-[9px] tracking-[0.3em] text-green-300">
          NO FEAR
        </span>
        <span className="arena-holo pointer-events-none absolute inset-0 z-[4]" />
      </div>
    </div>
  );
}
