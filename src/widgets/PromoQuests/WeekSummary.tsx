import { CalendarCheck, CalendarDays, Flag, Trophy } from "lucide-react";
import type { PromoCharacter } from "@/actions/promoQuestActions";
import type { PromoQuest } from "@/shared/config/promoQuests";
import { cn } from "@/shared/lib/tw-merge";
import { StatTile, StatUnit } from "@/shared/ui";
import {
  dayScore,
  doneKey,
  fullDayScore,
  goalPercent,
  goalScore,
  groupBreakdown,
  groupOf,
  remainingHint,
  type DoneMarks,
} from "./promoQuestsModel";

type Props = {
  characters: PromoCharacter[];
  character: PromoCharacter;
  marks: DoneMarks;
  quests: PromoQuest[];
  goal: number;
  todayIndex: number | null;
};

export default function WeekSummary({
  characters,
  character,
  marks,
  quests,
  goal,
  todayIndex,
}: Props) {
  const group = groupOf(characters, character);
  const isLinked = group.length > 1;
  const score = goalScore(marks, characters, character, quests);
  const percent = goalPercent(score, goal);

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      <StatTile
        label={isLinked ? "Общий счет связки" : "Набрано за неделю"}
        icon={Trophy}
        hint={
          <>
            <GoalBar percent={percent} />
            {isLinked && (
              <span className="mt-1 block">
                {groupBreakdown(marks, group, quests)}
              </span>
            )}
          </>
        }
      >
        {score}
        <StatUnit>из {goal}</StatUnit>
      </StatTile>
      <StatTile
        label="Осталось до цели"
        icon={Flag}
        hint={remainingHint(score, fullDayScore(quests) * group.length, goal)}
      >
        {Math.max(0, goal - score)}
      </StatTile>
      <DayTile
        characterId={character.id}
        marks={marks}
        quests={quests}
        todayIndex={todayIndex}
      />
    </div>
  );
}

function GoalBar({ percent }: { percent: number }) {
  return (
    <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-muted">
      <div
        className={cn(
          "h-full rounded-full transition-all",
          percent >= 100 ? "bg-green-500" : "bg-primary",
        )}
        style={{ width: `${percent}%` }}
      />
    </div>
  );
}

type DayTileProps = {
  characterId: number;
  marks: DoneMarks;
  quests: PromoQuest[];
  todayIndex: number | null;
};

function DayTile({ characterId, marks, quests, todayIndex }: DayTileProps) {
  const perDay = fullDayScore(quests);

  if (todayIndex === null) {
    return (
      <StatTile
        label="За полный день"
        icon={CalendarDays}
        hint="если сдать все квесты"
      >
        {perDay}
      </StatTile>
    );
  }

  const doneToday = quests.filter((quest) =>
    marks.has(doneKey(characterId, quest.id, todayIndex)),
  ).length;

  return (
    <StatTile
      label="Сегодня"
      icon={CalendarCheck}
      hint={`Сдано квестов: ${doneToday} из ${quests.length}`}
    >
      {dayScore(marks, characterId, quests, todayIndex)}
      <StatUnit>из {perDay}</StatUnit>
    </StatTile>
  );
}
