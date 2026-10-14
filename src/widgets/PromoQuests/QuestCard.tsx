"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import type { PromoQuest } from "@/shared/config/promoQuests";
import { cn } from "@/shared/lib/tw-merge";
import BossTimer from "./BossTimer";
import PointsGem from "./PointsGem";
import {
  isQuestDone,
  pointsTier,
  type DoneMarks,
  type PointsTier,
} from "./promoQuestsModel";
import type { PromoDay } from "./promoWeeks";
import QuestVoucher from "./QuestVoucher";
import QuestWeekDots from "./QuestWeekDots";

type Props = {
  quest: PromoQuest;
  order: number;
  days: PromoDay[];
  selectedDay: number;
  characterId: number | null;
  server: string | null;
  marks: DoneMarks;
  todayIndex: number | null;
  onToggle: (quest: PromoQuest, dayIndex: number, isDone: boolean) => void;
};

const STAGGER_MS = 40;

const GLOW_CLASS: Record<PointsTier, string> = {
  common: "hover:shadow-zinc-500/15",
  rare: "hover:shadow-sky-500/20",
  epic: "hover:shadow-violet-500/25",
  legendary: "hover:shadow-amber-500/30",
};

export default function QuestCard({
  quest,
  order,
  days,
  selectedDay,
  characterId,
  server,
  marks,
  todayIndex,
  onToggle,
}: Props) {
  const [doneBursts, setDoneBursts] = useState(0);
  const isDone = isQuestDone(marks, characterId, quest.id, selectedDay);

  const handleToggle = () => {
    if (!isDone) setDoneBursts((count) => count + 1);
    onToggle(quest, selectedDay, !isDone);
  };

  return (
    <article
      style={{ animationDelay: `${order * STAGGER_MS}ms` }}
      className={cn(
        "promo-rise relative flex flex-col gap-2 rounded-2xl border bg-card p-3 shadow-sm transition-[translate,box-shadow,border-color,background-color] duration-200 hover:-translate-y-0.5 hover:shadow-lg",
        GLOW_CLASS[pointsTier(quest.points)],
        isDone && "border-emerald-500/40 bg-emerald-500/5",
      )}
    >
      <button
        type="button"
        aria-pressed={isDone}
        aria-label={quest.name}
        disabled={characterId === null}
        onClick={handleToggle}
        className="group flex w-full cursor-pointer items-start gap-3 rounded-xl text-left outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-default"
      >
        <PointsGem points={quest.points} />
        <span className="flex min-w-0 flex-1 flex-col gap-0.5 pt-0.5">
          <span className="leading-snug font-semibold">{quest.name}</span>
          <span className="text-xs text-muted-foreground">{quest.hint}</span>
        </span>
        <DoneSeal isDone={isDone} />
      </button>
      {doneBursts > 0 && (
        <span
          key={doneBursts}
          aria-hidden="true"
          className="promo-float pointer-events-none absolute top-0 right-4 text-base font-black text-emerald-600 dark:text-emerald-400"
        >
          +{quest.points}
        </span>
      )}
      {quest.bossHour !== undefined && todayIndex !== null && (
        <BossTimer gameHour={quest.bossHour} />
      )}
      {quest.voucher && (
        <QuestVoucher voucher={quest.voucher} server={server} />
      )}
      <QuestWeekDots
        quest={quest}
        days={days}
        characterId={characterId}
        marks={marks}
        todayIndex={todayIndex}
        onToggle={onToggle}
      />
    </article>
  );
}

function DoneSeal({ isDone }: { isDone: boolean }) {
  return (
    <span
      className={cn(
        "grid size-8 shrink-0 place-items-center rounded-full border-2 transition-colors",
        isDone
          ? "promo-pop border-emerald-500 bg-emerald-500 text-white shadow-md shadow-emerald-500/30"
          : "border-dashed border-muted-foreground/30 text-transparent group-enabled:group-hover:border-emerald-500/60 group-enabled:group-hover:text-emerald-500/60",
      )}
    >
      <Check className="size-4" strokeWidth={3} />
    </span>
  );
}
