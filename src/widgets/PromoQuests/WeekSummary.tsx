import { CalendarCheck, CalendarDays, Flag } from "lucide-react";
import type { PromoCharacter } from "@/actions/promoQuestActions";
import type { PromoQuest } from "@/shared/config/promoQuests";
import { cn } from "@/shared/lib/tw-merge";
import { StatTile, StatUnit } from "@/shared/ui";
import GoalRing from "./GoalRing";
import {
  dayScore,
  fullDayScore,
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

const STAT_CLASS = "bg-background/60 py-2";

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
  const perDay = fullDayScore(quests);

  return (
    <section className="promo-rise relative overflow-hidden rounded-2xl border bg-card p-4 sm:p-5">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 -right-16 size-64 rounded-full bg-amber-400/15 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-28 -left-10 size-64 rounded-full bg-violet-500/10 blur-3xl"
      />
      <div className="relative flex flex-col items-center gap-4 sm:flex-row sm:gap-6">
        <GoalRing score={score} goal={goal} />
        <div className="flex w-full min-w-0 flex-1 flex-col gap-3">
          <div className="text-center sm:text-left">
            <h2 className="text-lg font-bold tracking-tight">
              {isLinked ? "Общий счет связки" : "Счет недели"}
            </h2>
            <p
              className={cn(
                score >= goal
                  ? "font-medium text-emerald-600 dark:text-emerald-400"
                  : "text-muted-foreground",
              )}
            >
              {remainingHint(score, perDay * group.length, goal)}
            </p>
            {isLinked && (
              <p className="mt-0.5 text-xs text-muted-foreground">
                {groupBreakdown(marks, group, quests)}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2">
            <StatTile
              icon={Flag}
              label="Осталось до цели"
              className={STAT_CLASS}
            >
              {Math.max(0, goal - score)}
            </StatTile>
            <DayStat
              characterId={character.id}
              marks={marks}
              quests={quests}
              todayIndex={todayIndex}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

type DayStatProps = {
  characterId: number;
  marks: DoneMarks;
  quests: PromoQuest[];
  todayIndex: number | null;
};

function DayStat({ characterId, marks, quests, todayIndex }: DayStatProps) {
  const perDay = fullDayScore(quests);
  if (todayIndex === null) {
    return (
      <StatTile
        icon={CalendarDays}
        label="За полный день"
        className={STAT_CLASS}
      >
        {perDay}
      </StatTile>
    );
  }

  return (
    <StatTile icon={CalendarCheck} label="Сегодня" className={STAT_CLASS}>
      {dayScore(marks, characterId, quests, todayIndex)}
      <StatUnit>из {perDay}</StatUnit>
    </StatTile>
  );
}
