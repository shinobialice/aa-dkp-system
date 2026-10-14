"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { PromoCharacter } from "@/actions/promoQuestActions";
import type { PromoQuest } from "@/shared/config/promoQuests";
import { launchConfetti } from "@/widgets/AnniversaryBalloons/launchConfetti";
import DayStrip from "./DayStrip";
import { completesGoal, goalScore } from "./promoQuestsModel";
import { weekDays, type PromoWeek } from "./promoWeeks";
import QuestBoard from "./QuestBoard";
import WeekSummary from "./WeekSummary";
import type { PromoWeekState } from "./usePromoWeek";

type Props = {
  state: PromoWeekState;
  week: PromoWeek;
  character: PromoCharacter | null;
  todayIndex: number | null;
};

const CONFETTI_ORIGIN = { x: 0.5, y: 0.35 };

export default function WeekQuests({
  state,
  week,
  character,
  todayIndex,
}: Props) {
  const [selectedDay, setSelectedDay] = useState(todayIndex ?? 0);

  if (week.quests.length === 0) {
    return (
      <p className="rounded-xl border border-dashed px-4 py-10 text-center text-muted-foreground">
        Квесты этой недели еще не внесены
      </p>
    );
  }

  const days = weekDays(week.start);

  const handleToggle = (
    quest: PromoQuest,
    dayIndex: number,
    isDone: boolean,
  ) => {
    if (!character) return;
    const score = goalScore(
      state.marks,
      state.characters,
      character,
      week.quests,
    );
    if (isDone && completesGoal(score, quest.points, week.goal)) {
      launchConfetti(CONFETTI_ORIGIN);
      toast.success("Цель недели выполнена!");
    }
    state.toggleDay(character.id, quest.id, dayIndex, isDone);
  };

  return (
    <>
      {character && (
        <WeekSummary
          characters={state.characters}
          character={character}
          marks={state.marks}
          quests={week.quests}
          goal={week.goal}
          todayIndex={todayIndex}
        />
      )}
      <DayStrip
        days={days}
        quests={week.quests}
        characterId={character?.id ?? null}
        marks={state.marks}
        todayIndex={todayIndex}
        selected={selectedDay}
        onSelect={setSelectedDay}
      />
      <QuestBoard
        quests={week.quests}
        weekStart={week.start}
        days={days}
        selectedDay={selectedDay}
        characterId={character?.id ?? null}
        server={character?.server ?? null}
        marks={state.marks}
        todayIndex={todayIndex}
        onToggle={handleToggle}
      />
    </>
  );
}
