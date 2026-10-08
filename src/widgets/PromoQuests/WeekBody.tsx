"use client";

import { UserPlus } from "lucide-react";
import type { PromoCharacter } from "@/actions/promoQuestActions";
import { errorMessage } from "@/shared/lib/errorMessage";
import { Button, Skeleton } from "@/shared/ui";
import CharacterPills from "./CharacterPills";
import type { PromoWeek } from "./promoWeeks";
import WeekQuests from "./WeekQuests";
import type { PromoWeekState } from "./usePromoWeek";

type Props = {
  state: PromoWeekState;
  week: PromoWeek;
  todayIndex: number | null;
  characterId: number | null;
  onCharacterSelect: (characterId: number) => void;
  onCharacterAdd: () => void;
  onCharacterEdit: (character: PromoCharacter) => void;
};

export default function WeekBody({
  state,
  week,
  todayIndex,
  characterId,
  onCharacterSelect,
  onCharacterAdd,
  onCharacterEdit,
}: Props) {
  if (state.isLoading) return <Skeleton className="h-72 rounded-xl" />;

  if (state.error) {
    return (
      <div className="flex flex-col items-start gap-2 rounded-xl border border-destructive/40 bg-destructive/5 px-4 py-3">
        <span className="text-destructive">
          {errorMessage(state.error, "Не удалось загрузить квесты ивента")}
        </span>
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer"
          onClick={state.reload}
        >
          Повторить
        </Button>
      </div>
    );
  }

  const character =
    state.characters.find((other) => other.id === characterId) ??
    state.characters.at(0) ??
    null;

  return (
    <>
      {character && (
        <CharacterPills
          characters={state.characters}
          selected={character}
          marks={state.marks}
          week={week}
          onSelect={onCharacterSelect}
          onAdd={onCharacterAdd}
          onEdit={onCharacterEdit}
        />
      )}
      {!character && <NoCharacters onAdd={onCharacterAdd} />}
      <WeekQuests
        state={state}
        week={week}
        character={character}
        todayIndex={todayIndex}
      />
    </>
  );
}

function NoCharacters({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-dashed px-4 py-3">
      <UserPlus className="size-6 shrink-0 text-muted-foreground" />
      <p className="min-w-0 flex-1 text-muted-foreground">
        Добавьте персонажа, чтобы отмечать квесты, считать баллы и видеть, где
        сдавать ресурсы на вашем сервере
      </p>
      <Button className="cursor-pointer" onClick={onAdd}>
        Добавить персонажа
      </Button>
    </div>
  );
}
