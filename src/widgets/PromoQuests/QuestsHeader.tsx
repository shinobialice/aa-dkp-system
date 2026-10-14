import type { ReactNode } from "react";
import { CalendarRange, Target } from "lucide-react";
import { pointsLabel } from "./promoQuestsModel";

type Props = {
  title: string;
  status: string;
  goal: number;
  isRunning: boolean;
};

export default function QuestsHeader({
  title,
  status,
  goal,
  isRunning,
}: Props) {
  return (
    <div className="promo-rise flex flex-col gap-2">
      <h1 className="promo-title text-3xl font-black tracking-tight sm:text-4xl">
        {title}
      </h1>
      <div className="flex flex-wrap gap-1.5 text-xs">
        <HeaderChip>
          {isRunning && (
            <span className="size-2 rounded-full bg-emerald-500 motion-safe:animate-pulse" />
          )}
          {status}
        </HeaderChip>
        <HeaderChip>
          <Target className="size-3.5" />
          Цель — {pointsLabel(goal)} в неделю
        </HeaderChip>
        <HeaderChip>
          <CalendarRange className="size-3.5" />С четверга по среду, время
          московское
        </HeaderChip>
      </div>
    </div>
  );
}

function HeaderChip({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border bg-card px-2.5 py-1 font-medium text-muted-foreground">
      {children}
    </span>
  );
}
