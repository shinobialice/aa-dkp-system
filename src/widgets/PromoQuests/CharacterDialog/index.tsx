"use client";

import type { PromoCharacter } from "@/actions/promoQuestActions";
import { useRetainedValue } from "@/hooks/useRetainedValue";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/shared/ui";
import CharacterForm from "./CharacterForm";

export type CharacterDialogRequest = { character?: PromoCharacter };

type Props = {
  request: CharacterDialogRequest | null;
  characters: PromoCharacter[];
  onClose: () => void;
  onSaved: () => Promise<void>;
};

export default function CharacterDialog({
  request,
  characters,
  onClose,
  onSaved,
}: Props) {
  const shown = useRetainedValue(request);
  const isEdit = !!shown?.character;

  const handleSaved = async () => {
    await onSaved();
    onClose();
  };

  return (
    <Dialog open={!!request} onOpenChange={(open) => !open && onClose()}>
      <DialogContent aria-describedby={undefined} className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Настройки персонажа" : "Новый персонаж"}
          </DialogTitle>
        </DialogHeader>
        {shown && (
          <CharacterForm
            key={shown.character?.id ?? "new"}
            character={shown.character}
            characters={characters}
            onCancel={onClose}
            onSaved={handleSaved}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
