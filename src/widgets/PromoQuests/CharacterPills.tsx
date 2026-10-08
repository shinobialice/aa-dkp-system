import { Link2, Plus, Settings2 } from "lucide-react";
import type { PromoCharacter } from "@/actions/promoQuestActions";
import { cn } from "@/shared/lib/tw-merge";
import { Button } from "@/shared/ui";
import { goalScore, groupOf, type DoneMarks } from "./promoQuestsModel";
import type { PromoWeek } from "./promoWeeks";

type Props = {
  characters: PromoCharacter[];
  selected: PromoCharacter;
  marks: DoneMarks;
  week: PromoWeek;
  onSelect: (characterId: number) => void;
  onAdd: () => void;
  onEdit: (character: PromoCharacter) => void;
};

export default function CharacterPills({
  characters,
  selected,
  marks,
  week,
  onSelect,
  onAdd,
  onEdit,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {characters.map((character) => {
        const isSelected = character.id === selected.id;
        const score = goalScore(marks, characters, character, week.quests);
        const isLinked = groupOf(characters, character).length > 1;
        return (
          <div
            key={character.id}
            className={cn(
              "flex items-center rounded-full border bg-card",
              isSelected && "border-primary bg-primary/10",
            )}
          >
            <button
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelect(character.id)}
              className="flex h-8 cursor-pointer items-center gap-1.5 rounded-full pr-2 pl-3 font-medium"
            >
              {isLinked && <Link2 className="size-3.5 text-primary" />}
              {character.name}
              <span
                className={cn(
                  "text-xs tabular-nums",
                  score >= week.goal
                    ? "font-semibold text-green-600 dark:text-green-400"
                    : "text-muted-foreground",
                )}
              >
                {score}/{week.goal}
              </span>
            </button>
            {isSelected && (
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Настроить персонажа ${character.name}`}
                onClick={() => onEdit(character)}
                className="mr-0.5 size-7 cursor-pointer rounded-full"
              >
                <Settings2 />
              </Button>
            )}
          </div>
        );
      })}
      <Button
        variant="outline"
        size="sm"
        onClick={onAdd}
        className="h-8 cursor-pointer rounded-full"
      >
        <Plus />
        Персонаж
      </Button>
    </div>
  );
}
