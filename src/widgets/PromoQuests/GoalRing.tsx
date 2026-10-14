"use client";

import { useId } from "react";
import { Trophy } from "lucide-react";
import { cn } from "@/shared/lib/tw-merge";
import { goalPercent } from "./promoQuestsModel";
import { useCountUp } from "./useCountUp";

type Props = {
  score: number;
  goal: number;
};

const SIZE = 132;
const STROKE = 12;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const PROGRESS_COLORS = ["#fcd34d", "#f97316", "#f43f5e"];
const REACHED_COLORS = ["#6ee7b7", "#10b981", "#047857"];

export default function GoalRing({ score, goal }: Props) {
  const gradientId = useId();
  const shownScore = useCountUp(score);
  const isReached = score >= goal;
  const arc = (goalPercent(shownScore, goal) / 100) * CIRCUMFERENCE;
  const colors = isReached ? REACHED_COLORS : PROGRESS_COLORS;

  return (
    <div className={cn("relative size-33 shrink-0", isReached && "promo-glow")}>
      <svg
        viewBox={`0 0 ${SIZE} ${SIZE}`}
        aria-hidden="true"
        className="size-full -rotate-90"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={colors[0]} />
            <stop offset="50%" stopColor={colors[1]} />
            <stop offset="100%" stopColor={colors[2]} />
          </linearGradient>
        </defs>
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          strokeWidth={STROKE}
          className="stroke-muted"
        />
        <circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          r={RADIUS}
          fill="none"
          strokeWidth={STROKE}
          strokeLinecap="round"
          stroke={`url(#${gradientId})`}
          strokeDasharray={`${arc} ${CIRCUMFERENCE}`}
          className={cn(arc === 0 && "opacity-0")}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        {isReached && (
          <Trophy className="promo-pop mb-1 size-5 text-emerald-500" />
        )}
        <span className="text-4xl leading-none font-black tracking-tight tabular-nums">
          {shownScore}
        </span>
        <span className="text-xs text-muted-foreground">из {goal}</span>
      </div>
    </div>
  );
}
