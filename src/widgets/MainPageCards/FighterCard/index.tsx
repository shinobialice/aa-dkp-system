"use client";

import { useState } from "react";
import type { MyFighterCard } from "@/actions/getMyFighterCard";
import { useClock } from "@/hooks/useClock";
import FighterCardBack from "./FighterCardBack";
import FighterCardFront from "./FighterCardFront";
import { useCardTilt } from "./useCardTilt";

const MINUTE_MS = 60_000;

type Props = {
  card: MyFighterCard;
};

export default function FighterCard({ card }: Props) {
  const [isFlipped, setIsFlipped] = useState(false);
  const tilt = useCardTilt();
  const now = useClock(MINUTE_MS);

  const handleFlip = () => {
    tilt.stopTilting();
    setIsFlipped((flipped) => !flipped);
  };

  return (
    <div className="arena-enter flex flex-col items-center gap-2.5">
      <button
        type="button"
        aria-pressed={isFlipped}
        aria-label="Карточка бойца, нажмите, чтобы перевернуть"
        data-flipped={isFlipped || undefined}
        data-tilting={tilt.isTilting || undefined}
        onPointerMove={tilt.handlePointerMove}
        onPointerLeave={tilt.handlePointerLeave}
        onClick={handleFlip}
        className="arena-card w-full max-w-[290px] cursor-pointer drop-shadow-[0_26px_30px_rgb(0_0_0/0.45)]"
      >
        <div className="arena-card-inner relative aspect-[5/7.3]">
          <FighterCardFront card={card} now={now} />
          <FighterCardBack card={card} now={now} />
        </div>
      </button>
      <p className="text-xs text-muted-foreground">
        Нажмите на карточку, чтобы перевернуть
      </p>
    </div>
  );
}
