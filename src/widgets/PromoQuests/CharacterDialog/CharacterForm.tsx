"use client";

import { useState, type FormEvent } from "react";
import { toast } from "sonner";
import type { PromoCharacter } from "@/actions/promoQuestActions";
import {
  createPromoCharacter,
  deletePromoCharacter,
  updatePromoCharacter,
} from "@/actions/promoCharacterActions";
import { errorMessage } from "@/shared/lib/errorMessage";
import { Button, DialogFooter, Input, Label } from "@/shared/ui";
import {
  initialPartnerId,
  MAX_CHARACTER_NAME_LENGTH,
} from "../promoQuestsModel";
import DeleteCharacterButton from "./DeleteCharacterButton";
import PartnerSelect from "./PartnerSelect";
import ServerSelect from "./ServerSelect";

type Props = {
  character?: PromoCharacter;
  characters: PromoCharacter[];
  onCancel: () => void;
  onSaved: () => Promise<void>;
};

export default function CharacterForm({
  character,
  characters,
  onCancel,
  onSaved,
}: Props) {
  const [name, setName] = useState(character?.name ?? "");
  const [server, setServer] = useState(character?.server ?? "");
  const [partnerId, setPartnerId] = useState(() =>
    initialPartnerId(characters, character),
  );
  const [isSaving, setIsSaving] = useState(false);
  const partners = characters.filter((other) => other.id !== character?.id);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      const input = { name, server, partnerId };
      if (character) await updatePromoCharacter(character.id, input);
      else await createPromoCharacter(input);
      await onSaved();
    } catch (error) {
      toast.error(errorMessage(error, "Не удалось сохранить персонажа"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (characterId: number) => {
    try {
      await deletePromoCharacter(characterId);
      await onSaved();
    } catch (error) {
      toast.error(errorMessage(error, "Не удалось удалить персонажа"));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2 py-4">
        <Label htmlFor="promo-character-name">Имя персонажа</Label>
        <Input
          id="promo-character-name"
          required
          maxLength={MAX_CHARACTER_NAME_LENGTH}
          value={name}
          onChange={(event) => setName(event.target.value)}
        />

        <Label htmlFor="promo-character-server" className="mt-2">
          Сервер
        </Label>
        <ServerSelect
          id="promo-character-server"
          value={server}
          onChange={setServer}
        />
        <p className="text-xs text-muted-foreground">
          По серверу в квестах на сдачу ресурсов видно, где их сдавать
        </p>

        {partners.length > 0 && (
          <>
            <Label htmlFor="promo-character-partner" className="mt-2">
              Общий счет с
            </Label>
            <PartnerSelect
              id="promo-character-partner"
              partners={partners}
              value={partnerId}
              onChange={setPartnerId}
            />
            <p className="text-xs text-muted-foreground">
              Связанные персонажи идут к цели недели вместе: баллы всех
              персонажей связки складываются
            </p>
          </>
        )}
      </div>

      <DialogFooter className="gap-2 sm:justify-between">
        {character && (
          <DeleteCharacterButton
            characterName={character.name}
            onDelete={() => handleDelete(character.id)}
          />
        )}
        <div className="flex flex-col-reverse gap-2 sm:ml-auto sm:flex-row">
          <Button
            type="button"
            variant="secondary"
            className="cursor-pointer"
            onClick={onCancel}
          >
            Отмена
          </Button>
          <Button type="submit" className="cursor-pointer" disabled={isSaving}>
            Сохранить
          </Button>
        </div>
      </DialogFooter>
    </form>
  );
}
