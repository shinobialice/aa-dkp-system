"use client";

import { useState } from "react";
import type { PromoEvent } from "@/server/promo";
import { PROMO_QUEST_EVENTS } from "@/shared/config/promoQuests";
import EventBanner from "@/widgets/MainPageCards/EventBanner";
import CharacterDialog, {
  type CharacterDialogRequest,
} from "./CharacterDialog";
import QuestsHeader from "./QuestsHeader";
import {
  currentPromoWeek,
  dayIndexOf,
  promoStatus,
  promoWeeks,
  runningWeekNumber,
} from "./promoWeeks";
import WeekBody from "./WeekBody";
import WeekTabs from "./WeekTabs";
import { usePromoWeek } from "./usePromoWeek";

type Props = {
  event: PromoEvent;
  startKey: string;
  todayKey: string;
};

export default function PromoQuests({ event, startKey, todayKey }: Props) {
  const questEvent = PROMO_QUEST_EVENTS[event.promo];
  const weeks = promoWeeks(questEvent, startKey);
  const [weekNumber, setWeekNumber] = useState(
    () => currentPromoWeek(weeks, todayKey).number,
  );
  const [characterId, setCharacterId] = useState<number | null>(null);
  const [dialog, setDialog] = useState<CharacterDialogRequest | null>(null);
  const week = weeks[weekNumber - 1];
  const state = usePromoWeek(week.start);

  return (
    <div className="mx-auto flex w-full max-w-6xl min-w-0 flex-col gap-4 text-sm">
      <EventBanner event={event} />
      <QuestsHeader
        title={event.title ?? "Ивент"}
        status={promoStatus(weeks, todayKey)}
        goal={questEvent.weeklyGoal}
      />
      <WeekTabs
        weeks={weeks}
        selected={weekNumber}
        running={runningWeekNumber(weeks, todayKey)}
        onSelect={setWeekNumber}
      />
      <WeekBody
        state={state}
        week={week}
        todayIndex={dayIndexOf(week.start, todayKey)}
        characterId={characterId}
        onCharacterSelect={setCharacterId}
        onCharacterAdd={() => setDialog({})}
        onCharacterEdit={(character) => setDialog({ character })}
      />
      <CharacterDialog
        request={dialog}
        characters={state.characters}
        onClose={() => setDialog(null)}
        onSaved={state.reload}
      />
    </div>
  );
}
