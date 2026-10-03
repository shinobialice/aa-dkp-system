"use client";

import { useRef, useState, type FormEvent } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import type { WarOpponentsState } from "@/actions/warOpponents";
import { Button, DialogFooter } from "@/shared/ui";
import type { SaveOpponents } from ".";
import OpponentField from "./OpponentField";
import {
  newDraftRow,
  savedDraftRows,
  statusHint,
  type DraftRow,
} from "./opponentDrafts";
import { errorMessage } from "@/shared/lib/errorMessage";

type Props = {
  state: WarOpponentsState;
  warStartedAt: string | null;
  onSave: SaveOpponents;
  onCancel: () => void;
};

export default function OpponentsForm({
  state,
  warStartedAt,
  onSave,
  onCancel,
}: Props) {
  const [primaryName, setPrimaryName] = useState(state.primary.name ?? "");
  const [primaryEnded, setPrimaryEnded] = useState(
    state.primary.endedAt !== null,
  );
  const [rows, setRows] = useState(() => savedDraftRows(state));
  const [saving, setSaving] = useState(false);
  const nextKey = useRef(0);

  const updateRow = (key: string, patch: Partial<DraftRow>) => {
    setRows((current) =>
      current.map((row) => (row.key === key ? { ...row, ...patch } : row)),
    );
  };

  const handleAddRow = () => {
    nextKey.current += 1;
    setRows((current) => [...current, newDraftRow(`new-${nextKey.current}`)]);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (rows.some((row) => !row.name.trim())) {
      toast.error("Укажите название гильдии-противника");
      return;
    }
    setSaving(true);
    try {
      await onSave(
        { name: primaryName.trim() || null, ended: primaryEnded },
        rows.map((row) => ({
          id: row.id,
          name: row.name.trim(),
          ended: row.ended,
        })),
      );
      toast.success("Противники сохранены");
    } catch (error) {
      toast.error(errorMessage(error, "Не удалось сохранить"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <OpponentField
        inputId="war-opponent-primary"
        label="Противник 1"
        name={primaryName}
        hint={statusHint({
          isNew: false,
          startedAt: warStartedAt,
          savedEndedAt: state.primary.endedAt,
          ended: primaryEnded,
        })}
        ended={primaryEnded}
        disabled={saving}
        onNameChange={setPrimaryName}
        onToggleEnded={() => setPrimaryEnded(!primaryEnded)}
      />

      {rows.map((row, index) => (
        <OpponentField
          key={row.key}
          inputId={`war-opponent-${row.key}`}
          label={`Противник ${index + 2}`}
          name={row.name}
          hint={statusHint({
            isNew: row.id === null,
            startedAt: row.startedAt,
            savedEndedAt: row.savedEndedAt,
            ended: row.ended,
          })}
          ended={row.ended}
          disabled={saving}
          autoFocus={row.id === null}
          onNameChange={(name) => updateRow(row.key, { name })}
          onToggleEnded={() => updateRow(row.key, { ended: !row.ended })}
          onRemove={
            row.id === null
              ? () => setRows(rows.filter((item) => item.key !== row.key))
              : undefined
          }
        />
      ))}

      <Button
        type="button"
        variant="outline"
        size="sm"
        className="cursor-pointer"
        disabled={saving}
        onClick={handleAddRow}
      >
        <Plus className="size-4" />
        Добавить противника
      </Button>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          className="cursor-pointer"
          disabled={saving}
          onClick={onCancel}
        >
          Отмена
        </Button>
        <Button type="submit" className="cursor-pointer" disabled={saving}>
          Сохранить
        </Button>
      </DialogFooter>
    </form>
  );
}
