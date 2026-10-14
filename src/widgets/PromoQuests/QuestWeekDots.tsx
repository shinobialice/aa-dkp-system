import type { PromoQuest } from "@/shared/config/promoQuests";
import { cn } from "@/shared/lib/tw-merge";
import {
  isQuestDone,
  questDoneCount,
  type DoneMarks,
} from "./promoQuestsModel";
import type { PromoDay } from "./promoWeeks";

type Props = {
  quest: PromoQuest;
  days: PromoDay[];
  characterId: number | null;
  marks: DoneMarks;
  todayIndex: number | null;
  onToggle: (quest: PromoQuest, dayIndex: number, isDone: boolean) => void;
};

export default function QuestWeekDots({
  quest,
  days,
  characterId,
  marks,
  todayIndex,
  onToggle,
}: Props) {
  const weekPoints =
    quest.points * questDoneCount(marks, characterId, quest.id);

  return (
    <div className="mt-auto flex items-center gap-1 border-t border-dashed pt-2">
      {days.map((day) => {
        const isDone = isQuestDone(marks, characterId, quest.id, day.index);
        return (
          <button
            key={day.key}
            type="button"
            title={day.name}
            aria-label={`${quest.name}, ${day.name}`}
            aria-pressed={isDone}
            disabled={characterId === null}
            onClick={() => onToggle(quest, day.index, !isDone)}
            className={cn(
              "size-5 cursor-pointer rounded-md border transition-[background-color,border-color,scale] hover:scale-115 disabled:cursor-default disabled:hover:scale-100",
              isDone ? "border-emerald-500 bg-emerald-500" : "bg-muted",
              day.index === todayIndex &&
                "ring-2 ring-amber-500/60 ring-offset-1 ring-offset-card",
            )}
          />
        );
      })}
      <span className="ml-auto text-xs text-muted-foreground">
        за неделю{" "}
        <span className="font-semibold text-foreground tabular-nums">
          {weekPoints}
        </span>
      </span>
    </div>
  );
}
