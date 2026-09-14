"use client";
import { useState } from "react";
import { toast } from "sonner";
import saveUserSeals from "@/actions/saveUserSeals";
import type { UserSeal } from "@/actions/getUserSeals";
import SealIcon from "./SealIcon";
import SealLevelList from "./SealLevelList";
import SealBonusSummaryButton from "./SealBonusSummaryButton";
import {
  SEAL_NAMES,
  SEAL_INFO,
  SEAL_ROLE_COLORS,
  MAX_USER_SEALS,
  MAX_SEAL_LEVEL,
  DEFAULT_SEAL_LEVEL,
  getSealGradeForLevel,
  getSealGradeLabel,
} from "./sealsData";
import { Badge } from "@/shared/ui";
import { Button } from "@/shared/ui";
import { Input } from "@/shared/ui";
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

type SealSlot = { name: string | null; level: number };

function SealOptionLabel({ name }: { name: string }) {
  const info = SEAL_INFO[name as keyof typeof SEAL_INFO];
  if (!info) return <>{name}</>;
  return (
    <>
      {name} — {info.playstyle} (
      {info.roles.map((role, i) => (
        <span key={role}>
          {i > 0 && ", "}
          <span style={{ color: SEAL_ROLE_COLORS[role] }}>{role}</span>
        </span>
      ))}
      )
    </>
  );
}

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
        value === NONE
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
        <CardTitle className="flex items-center justify-between gap-2">
          Печати героя
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
        {(() => {
          if (editing) {
            return (
              <div className="text-sm text-muted-foreground">
                Выбрано веток: {draft.filter((s) => s.name).length} /{" "}
                {MAX_USER_SEALS}
              </div>
            );
          }
          return null;
        })()}
        {(() => {
          if (editing) {
            return (
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {draft.map((slot, i) => {
                  const otherChosen = draft
                    .filter((_, j) => j !== i)
                    .map((s) => s.name)
                    .filter((name): name is string => !!name);
                  const grade = getSealGradeForLevel(slot.level);
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
                              <SealOptionLabel name={name} />
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {slot.name && (
                        <div className="space-y-1.5 rounded-lg border p-2">
                          <div className="flex items-center justify-between gap-2 text-sm">
                            <span>
                              Уровень{" "}
                              <span className="font-semibold">
                                {slot.level}
                              </span>{" "}
                              — {getSealGradeLabel(grade)}
                            </span>
                            <Input
                              type="number"
                              min={0}
                              max={MAX_SEAL_LEVEL}
                              value={slot.level}
                              onChange={(e) => {
                                const v = Math.max(
                                  0,
                                  Math.min(
                                    MAX_SEAL_LEVEL,
                                    Number(e.target.value) || 0,
                                  ),
                                );
                                setLevel(i, v);
                              }}
                              className="h-8 w-16 text-right"
                            />
                          </div>
                          <div className="space-y-1 text-xs font-medium text-muted-foreground">
                            Выбрать по списку уровней
                          </div>
                          <SealLevelList
                            sealName={slot.name}
                            level={slot.level}
                            onSelectLevel={(level) => setLevel(i, level)}
                          />
                        </div>
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
                const grade = getSealGradeForLevel(seal.level);
                const info =
                  SEAL_INFO[seal.seal_name as keyof typeof SEAL_INFO];
                return (
                  <div
                    key={seal.id}
                    className="flex flex-col items-center gap-2 rounded-lg border p-3"
                  >
                    <SealIcon grade={grade} size={44} />
                    <div className="text-center">
                      <div className="text-sm font-semibold">
                        {seal.seal_name}
                      </div>
                      {info && (
                        <div className="text-xs text-muted-foreground">
                          {info.playstyle}
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center justify-center gap-1">
                      <Badge variant="outline">
                        {getSealGradeLabel(grade)}
                      </Badge>
                      <Badge variant="secondary">Ур. {seal.level}</Badge>
                    </div>
                    <div className="w-full space-y-1 text-center text-xs font-medium text-muted-foreground">
                      Бонусы по уровням
                    </div>
                    <SealLevelList
                      sealName={seal.seal_name}
                      level={seal.level}
                    />
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
