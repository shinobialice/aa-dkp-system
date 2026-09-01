"use client";

import { useState } from "react";
import { Pencil, Check, X } from "lucide-react";
import { toast } from "sonner";
import { Button, Input } from "@/shared/ui";
import { updateWarOpponent } from "@/actions/guildStatusSettings";

// Инлайн-редактирование имени гильдии-противника: карандаш -> инпут ->
// галочка/крестик. Паттерн взят из ProfileHeader.tsx (там так же редактируют
// ник — без Dialog/Popover, просто условный рендер Input вместо текста).
export default function WarOpponentEditor({
  initialOpponent,
  isAdmin,
}: {
  initialOpponent: string | null;
  isAdmin: boolean;
}) {
  const [opponent, setOpponent] = useState(initialOpponent);
  const [editMode, setEditMode] = useState(false);
  const [draft, setDraft] = useState(initialOpponent ?? "");
  const [saving, setSaving] = useState(false);

  function startEdit() {
    setDraft(opponent ?? "");
    setEditMode(true);
  }

  function cancelEdit() {
    setEditMode(false);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const trimmed = draft.trim() || null;
      await updateWarOpponent(trimmed);
      setOpponent(trimmed);
      setEditMode(false);
      toast.success("Название гильдии-противника сохранено");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Не удалось сохранить",
      );
    } finally {
      setSaving(false);
    }
  }

  if (editMode) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-lg text-muted-foreground">против</span>
        <Input
          autoFocus
          className="h-8 w-56 text-lg font-bold"
          value={draft}
          disabled={saving}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSave();
            if (e.key === "Escape") cancelEdit();
          }}
        />
        <Button
          variant="ghost"
          size="icon"
          className="size-8 text-green-500 cursor-pointer"
          disabled={saving}
          onClick={handleSave}
        >
          <Check />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 text-muted-foreground cursor-pointer"
          disabled={saving}
          onClick={cancelEdit}
        >
          <X />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-lg">
        против{" "}
        <strong className="text-destructive">
          {opponent ?? "противник не указан"}
        </strong>
      </span>
      {isAdmin && (
        <Button
          variant="ghost"
          size="icon"
          className="size-7 text-muted-foreground cursor-pointer"
          onClick={startEdit}
        >
          <Pencil className="size-4" />
        </Button>
      )}
    </div>
  );
}
