"use client";
import { useState } from "react";
import { toast } from "sonner";
import saveUserSeals from "@/actions/saveUserSeals";
import type { UserSeal } from "@/actions/getUserSeals";
import SealBonusSummaryButton from "./SealBonusSummaryButton";
import { MAX_USER_SEALS, DEFAULT_SEAL_LEVEL } from "./sealsData";
import { Button } from "@/shared/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";
import CharacterTabsSwitcher from "@/widgets/profile/CharacterTabsSwitcher";
import { errorMessage } from "@/shared/lib/errorMessage";
import SealSlotEditor, { NO_SEAL, type SealSlot } from "./SealSlotEditor";
import SealsGrid from "./SealsGrid";

type Props = {
  userId: number;
  seals: UserSeal[];
  onChange: (seals: UserSeal[]) => void;
  canEdit: boolean;
};

export default function SealsTab({ userId, seals, onChange, canEdit }: Props) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState<SealSlot[]>([]);

  const startEditing = () => {
    setDraft(
      Array.from({ length: MAX_USER_SEALS }, (_, i) => ({
        name: seals[i]?.seal_name ?? null,
        level: seals[i]?.level ?? DEFAULT_SEAL_LEVEL,
      })),
    );
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
    setDraft([]);
  };

  const setSealName = (index: number, value: string) => {
    setDraft((prev) => {
      const next = [...prev];
      next[index] =
        value === NO_SEAL
          ? { name: null, level: DEFAULT_SEAL_LEVEL }
          : { name: value, level: next[index]?.level ?? DEFAULT_SEAL_LEVEL };
      return next;
    });
  };

  const setLevel = (index: number, level: number) => {
    setDraft((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], level };
      return next;
    });
  };

  const currentPicks = (
    editing
      ? draft.map((s) => ({ sealName: s.name, level: s.level }))
      : seals.map((s) => ({ sealName: s.seal_name, level: s.level }))
  ).filter((p): p is { sealName: string; level: number } => !!p.sealName);

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = draft
        .filter((slot): slot is { name: string; level: number } => !!slot.name)
        .map((slot) => ({ sealName: slot.name, level: slot.level }));
      const updated = await saveUserSeals(userId, payload);
      onChange(updated);
      setEditing(false);
      toast.success("Печати сохранены");
    } catch (error) {
      toast.error(errorMessage(error, "Не удалось сохранить печати"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="min-h-187.5 gap-3 py-4">
      <CardHeader className="border-b">
        <CardTitle className="flex flex-wrap items-center justify-between gap-2">
          <CharacterTabsSwitcher />
          <div className="flex gap-2">
            <SealBonusSummaryButton picks={currentPicks} />
            {canEdit && !editing && (
              <Button
                variant="outline"
                className="cursor-pointer"
                onClick={startEditing}
              >
                Изменить
              </Button>
            )}
            {canEdit && editing && (
              <>
                <Button
                  variant="ghost"
                  className="cursor-pointer"
                  onClick={cancelEditing}
                  disabled={saving}
                >
                  Отмена
                </Button>
                <Button
                  className="cursor-pointer"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? "Сохранение..." : "Сохранить"}
                </Button>
              </>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-3">
        {editing && (
          <>
            <div className="text-sm text-muted-foreground">
              Выбрано веток: {draft.filter((slot) => slot.name).length} /{" "}
              {MAX_USER_SEALS}
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {draft.map((slot, index) => (
                <SealSlotEditor
                  key={index}
                  index={index}
                  slot={slot}
                  takenNames={draft
                    .filter((_, other) => other !== index)
                    .flatMap((other) => (other.name ? [other.name] : []))}
                  onNameChange={(value) => setSealName(index, value)}
                  onLevelChange={(level) => setLevel(index, level)}
                />
              ))}
            </div>
          </>
        )}
        {!editing && <SealsGrid seals={seals} />}
      </CardContent>
    </Card>
  );
}
