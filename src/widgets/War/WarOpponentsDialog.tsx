"use client";

import { useRef, useState, type ReactNode } from "react";
import { Plus, X } from "lucide-react";
import { toast } from "sonner";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
} from "@/shared/ui";
import type {
  WarOpponentDraft,
  WarOpponentsState,
} from "@/actions/guildStatusSettings";
import { formatDateRange, formatStartDate } from "./warModel";

type DraftRow = {
  key: string;
  id: number | null;
  name: string;
  startedAt: string | null;
  savedEndedAt: string | null;
  ended: boolean;
};

function statusHint({
  isNew,
  startedAt,
  savedEndedAt,
  ended,
}: {
  isNew: boolean;
  startedAt: string | null;
  savedEndedAt: string | null;
  ended: boolean;
}): string {
  if (isNew) return "счётчик пойдёт с момента сохранения";
  if (!startedAt) return "";
  if (ended && savedEndedAt) {
    return `слились: ${formatDateRange(startedAt, savedEndedAt)}`;
  }
  if (ended) return "счётчик остановится при сохранении";
  return `вар идёт с ${formatStartDate(startedAt)}`;
}

function OpponentField({
  inputId,
  label,
  name,
  hint,
  ended,
  disabled,
  autoFocus,
  onNameChange,
  onToggleEnded,
  onRemove,
}: {
  inputId: string;
  label: string;
  name: string;
  hint: string;
  ended: boolean;
  disabled: boolean;
  autoFocus?: boolean;
  onNameChange: (name: string) => void;
  onToggleEnded?: () => void;
  onRemove?: () => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={inputId}>{label}</Label>
      <div className="flex items-center gap-2">
        <Input
          id={inputId}
          autoFocus={autoFocus}
          value={name}
          placeholder="Название гильдии"
          className={ended ? "text-muted-foreground" : undefined}
          disabled={disabled}
          onChange={(e) => onNameChange(e.target.value)}
        />
        {onRemove ? (
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="shrink-0 text-muted-foreground cursor-pointer"
            aria-label="Убрать строку"
            disabled={disabled}
            onClick={onRemove}
          >
            <X className="size-4" />
          </Button>
        ) : (
          <Button
            type="button"
            variant={ended ? "secondary" : "outline"}
            size="sm"
            className="w-24 shrink-0 cursor-pointer"
            disabled={disabled}
            onClick={onToggleEnded}
          >
            {ended ? "Вернуть" : "Слились"}
          </Button>
        )}
      </div>
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export default function WarOpponentsDialog({
  state,
  warStartedAt,
  onSave,
  trigger,
}: {
  state: WarOpponentsState;
  warStartedAt: string | null;
  onSave: (
    primary: { name: string | null; ended: boolean },
    opponents: WarOpponentDraft[],
  ) => Promise<void>;
  trigger: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [primaryName, setPrimaryName] = useState("");
  const [primaryEnded, setPrimaryEnded] = useState(false);
  const [rows, setRows] = useState<DraftRow[]>([]);
  const [saving, setSaving] = useState(false);
  const nextKey = useRef(0);

  function handleOpenChange(next: boolean) {
    if (next) {
      setPrimaryName(state.primary.name ?? "");
      setPrimaryEnded(state.primary.endedAt !== null);
      setRows(
        state.opponents.map((o) => ({
          key: `saved-${o.id}`,
          id: o.id,
          name: o.name,
          startedAt: o.startedAt,
          savedEndedAt: o.endedAt,
          ended: o.endedAt !== null,
        })),
      );
    }
    setOpen(next);
  }

  function addRow() {
    nextKey.current += 1;
    setRows((prev) => [
      ...prev,
      {
        key: `new-${nextKey.current}`,
        id: null,
        name: "",
        startedAt: null,
        savedEndedAt: null,
        ended: false,
      },
    ]);
  }

  function updateRow(key: string, patch: Partial<DraftRow>) {
    setRows((prev) =>
      prev.map((r) => (r.key === key ? { ...r, ...patch } : r)),
    );
  }

  function removeRow(key: string) {
    setRows((prev) => prev.filter((r) => r.key !== key));
  }

  async function handleSave() {
    if (rows.some((r) => !r.name.trim())) {
      toast.error("Укажите название гильдии-противника");
      return;
    }
    setSaving(true);
    try {
      await onSave(
        { name: primaryName.trim() || null, ended: primaryEnded },
        rows.map((r) => ({ id: r.id, name: r.name.trim(), ended: r.ended })),
      );
      setOpen(false);
      toast.success("Противники сохранены");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Не удалось сохранить",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Противники</DialogTitle>
          <DialogDescription>
            Всё это один вар. Если противник ушёл — жми «Слились»: его счётчик
            остановится, а сам он останется на странице и в истории с датами.
          </DialogDescription>
        </DialogHeader>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleSave();
          }}
        >
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
            onToggleEnded={() => setPrimaryEnded((prev) => !prev)}
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
              onRemove={row.id === null ? () => removeRow(row.key) : undefined}
            />
          ))}

          <Button
            type="button"
            variant="outline"
            size="sm"
            className="cursor-pointer"
            disabled={saving}
            onClick={addRow}
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
              onClick={() => setOpen(false)}
            >
              Отмена
            </Button>
            <Button type="submit" className="cursor-pointer" disabled={saving}>
              Сохранить
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
