"use client";
import { useState } from "react";
import { toast } from "sonner";
import saveUserSeals from "@/actions/saveUserSeals";
import type { UserSeal } from "@/actions/getUserSeals";
import SealIcon from "./SealIcon";
import {
  SEAL_NAMES,
  SEAL_GRADES,
  MAX_USER_SEALS,
  DEFAULT_SEAL_GRADE,
  getSealGradeLabel,
} from "./sealsData";
import { Badge } from "@/shared/ui";
import { Button } from "@/shared/ui";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/shared/ui";

type Props = {
  userId: number;
  seals: UserSeal[];
  onChange: (seals: UserSeal[]) => void;
  canEdit: boolean;
};

const NONE = "Нет";

type SealSlot = { name: string | null; grade: number };

export default function SealsTab({ userId, seals, onChange, canEdit }: Props) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  // Черновик на время редактирования: MAX_USER_SEALS слотов, как в
  // "Класс персонажа" (селект на слот вместо чекбоксов на все печати сразу).
  const [draft, setDraft] = useState<SealSlot[]>([]);

  const startEditing = () => {
    setDraft(
      Array.from({ length: MAX_USER_SEALS }, (_, i) => ({
        name: seals[i]?.seal_name ?? null,
        grade: seals[i]?.grade ?? DEFAULT_SEAL_GRADE,
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
        value === NONE
          ? { name: null, grade: DEFAULT_SEAL_GRADE }
          : { name: value, grade: next[index]?.grade ?? DEFAULT_SEAL_GRADE };
      return next;
    });
  };

  const setGrade = (index: number, grade: number) => {
    setDraft((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], grade };
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = draft
        .filter((slot): slot is { name: string; grade: number } => !!slot.name)
        .map((slot) => ({ sealName: slot.name, grade: slot.grade }));
      const updated = await saveUserSeals(userId, payload);
      onChange(updated);
      setEditing(false);
      toast.success("Печати сохранены");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Не удалось сохранить печати",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="gap-3 py-4">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center justify-between">
          Печати героя
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
            <div className="flex gap-2">
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
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-3">
        {(() => {
          if (editing) {
            return (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {draft.map((slot, i) => {
                  const otherChosen = draft
                    .filter((_, j) => j !== i)
                    .map((s) => s.name)
                    .filter((name): name is string => !!name);
                  return (
                    <div key={i} className="space-y-1.5">
                      <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Печать {i + 1}
                      </div>
                      <Select
                        value={slot.name ?? NONE}
                        onValueChange={(v) => setSealName(i, v)}
                      >
                        <SelectTrigger className="w-full cursor-pointer">
                          <SelectValue placeholder="Не выбрано" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={NONE}>Нет</SelectItem>
                          {SEAL_NAMES.filter(
                            (name) => !otherChosen.includes(name),
                          ).map((name) => (
                            <SelectItem key={name} value={name}>
                              {name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {slot.name && (
                        <Select
                          value={String(slot.grade)}
                          onValueChange={(v) => setGrade(i, Number(v))}
                        >
                          <SelectTrigger className="w-full cursor-pointer">
                            <SelectValue placeholder="Редкость" />
                          </SelectTrigger>
                          <SelectContent>
                            {SEAL_GRADES.map((g) => (
                              <SelectItem key={g.grade} value={String(g.grade)}>
                                {g.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          }

          if (seals.length === 0) {
            return (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Печати не выбраны
              </div>
            );
          }

          return (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {Array.from({ length: MAX_USER_SEALS }).map((_, i) => {
                const seal = seals[i];
                if (!seal) {
                  return (
                    <div
                      key={`empty-${i}`}
                      className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-3 text-sm text-muted-foreground"
                    >
                      Не выбрано
                    </div>
                  );
                }
                return (
                  <div
                    key={seal.id}
                    className="flex flex-col items-center gap-2 rounded-lg border p-3"
                  >
                    <SealIcon grade={seal.grade} size={44} />
                    <div className="text-sm font-semibold">
                      {seal.seal_name}
                    </div>
                    <Badge variant="outline">
                      {getSealGradeLabel(seal.grade)}
                    </Badge>
                  </div>
                );
              })}
            </div>
          );
        })()}
      </CardContent>
    </Card>
  );
}
