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
import { Checkbox } from "@/shared/ui";
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

export default function SealsTab({ userId, seals, onChange, canEdit }: Props) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  // Черновик выбора на время редактирования: имя печати -> редкость.
  const [draft, setDraft] = useState<Record<string, number>>({});

  const startEditing = () => {
    const map: Record<string, number> = {};
    seals.forEach((s) => {
      map[s.seal_name] = s.grade;
    });
    setDraft(map);
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
    setDraft({});
  };

  const selectedCount = Object.keys(draft).length;

  const toggleSeal = (name: string) => {
    setDraft((prev) => {
      const next = { ...prev };
      if (name in next) {
        delete next[name];
        return next;
      }
      if (Object.keys(next).length >= MAX_USER_SEALS) {
        toast.error(`Можно выбрать не больше ${MAX_USER_SEALS} печатей`);
        return prev;
      }
      next[name] = DEFAULT_SEAL_GRADE;
      return next;
    });
  };

  const setGrade = (name: string, grade: number) => {
    setDraft((prev) => ({ ...prev, [name]: grade }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = Object.entries(draft).map(([sealName, grade]) => ({
        sealName,
        grade,
      }));
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
    <Card>
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
      <CardContent className="space-y-4 pt-4">
        {(() => {
          if (editing) {
            return (
              <>
                <div className="text-sm text-muted-foreground">
                  Выбрано {selectedCount} из {MAX_USER_SEALS}
                </div>
                <div className="space-y-2">
                  {SEAL_NAMES.map((name) => {
                    const isSelected = name in draft;
                    const grade = draft[name] ?? DEFAULT_SEAL_GRADE;
                    return (
                      <div
                        key={name}
                        className="flex items-center gap-3 rounded-md border p-2"
                      >
                        <Checkbox
                          checked={isSelected}
                          onCheckedChange={() => toggleSeal(name)}
                          disabled={!isSelected && selectedCount >= MAX_USER_SEALS}
                          className="cursor-pointer"
                        />
                        <SealIcon grade={isSelected ? grade : 1} size={32} />
                        <span className="flex-1 text-sm font-medium">{name}</span>
                        <Select
                          value={String(grade)}
                          onValueChange={(value) => setGrade(name, Number(value))}
                          disabled={!isSelected}
                        >
                          <SelectTrigger className="w-[190px] cursor-pointer">
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
                      </div>
                    );
                  })}
                </div>
              </>
            );
          }

          if (seals.length === 0) {
            return (
              <div className="py-8 text-center text-muted-foreground">
                Печати не выбраны
              </div>
            );
          }

          return (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {Array.from({ length: MAX_USER_SEALS }).map((_, i) => {
                const seal = seals[i];
                if (!seal) {
                  return (
                    <div
                      key={`empty-${i}`}
                      className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-4 text-sm text-muted-foreground"
                    >
                      Не выбрано
                    </div>
                  );
                }
                return (
                  <div
                    key={seal.id}
                    className="flex flex-col items-center gap-2 rounded-lg border p-4"
                  >
                    <SealIcon grade={seal.grade} size={56} />
                    <div className="text-sm font-semibold">{seal.seal_name}</div>
                    <Badge variant="outline">{getSealGradeLabel(seal.grade)}</Badge>
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
