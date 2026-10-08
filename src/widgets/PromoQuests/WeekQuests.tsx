import type { PromoCharacter } from "@/actions/promoQuestActions";
import type { PromoWeek } from "./promoWeeks";
import QuestTable from "./QuestTable";
import WeekSummary from "./WeekSummary";
import type { PromoWeekState } from "./usePromoWeek";

type Props = {
  state: PromoWeekState;
  week: PromoWeek;
  character: PromoCharacter | null;
  todayIndex: number | null;
};

export default function WeekQuests({
  state,
  week,
  character,
  todayIndex,
}: Props) {
  if (week.quests.length === 0) {
    return (
      <p className="rounded-xl border border-dashed px-4 py-10 text-center text-muted-foreground">
        Квесты этой недели еще не внесены
      </p>
    );
  }

  const handleToggle = (questId: number, dayIndex: number, isDone: boolean) => {
    if (character) state.toggleDay(character.id, questId, dayIndex, isDone);
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
      <QuestTable
        quests={week.quests}
        weekStart={week.start}
        characterId={character?.id ?? null}
        server={character?.server ?? null}
        marks={state.marks}
        todayIndex={todayIndex}
        onToggle={handleToggle}
      />
    </>
  );
}
