"use client";
import { useState } from "react";
import { toast } from "sonner";
import saveUserArchetype from "@/actions/saveUserArchetype";
import type {
  ArchetypeSlot,
  RoleSlot,
  UserArchetype,
} from "@/actions/getUserArchetype";
import { SpecializationIcon } from "./SpecializationIcon";
import { SPECIALIZATIONS, getSpecialization } from "./specializationsData";
import { lookupClassName } from "./classCombinations";
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

type SpecKey = "specialization1" | "specialization2" | "specialization3";

const SPEC_KEYS: SpecKey[] = [
  "specialization1",
  "specialization2",
  "specialization3",
];

const NONE = "Нет";

const ROLE_LABELS: Record<RoleSlot, string> = {
  1: "Роль 1",
  2: "Роль 2",
  3: "Роль 3",
};

// Роль 1 есть у всех, 2/3 — только если игрок их себе завёл (см. ProfileClasses).
function hasRole(user: any, slot: RoleSlot): boolean {
  if (slot === 1) return true;
  if (slot === 2) {
    return !!user.secondary_class || user.secondary_class_gear_score != null;
  }
  return !!user.tertiary_class || user.tertiary_class_gear_score != null;
}

function BuildEditor({
  slot,
  showLabel,
  draft,
  onSpecChange,
}: {
  slot: RoleSlot;
  showLabel: boolean;
  draft: ArchetypeSlot;
  onSpecChange: (key: SpecKey, value: string) => void;
}) {
  const comboMatch = lookupClassName([
    draft.specialization1,
    draft.specialization2,
    draft.specialization3,
  ]);

  return (
    <div className="space-y-3">
      {showLabel && (
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {ROLE_LABELS[slot]}
        </div>
      )}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {SPEC_KEYS.map((key, i) => {
          const otherChosen = SPEC_KEYS.filter((k) => k !== key)
            .map((k) => draft[k])
            .filter(Boolean);
          const value = draft[key] ?? NONE;
          return (
            <div key={key} className="space-y-1.5">
              <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Специализация {i + 1}
              </div>
              <Select value={value} onValueChange={(v) => onSpecChange(key, v)}>
                <SelectTrigger className="w-full cursor-pointer">
                  <SelectValue placeholder="Не выбрано" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE}>Нет</SelectItem>
                  {SPECIALIZATIONS.filter(
                    (spec) => !otherChosen.includes(spec.id),
                  ).map((spec) => (
                    <SelectItem key={spec.id} value={spec.id}>
                      <span className="flex items-center gap-2">
                        <SpecializationIcon id={spec.id} size={16} />
                        {spec.name}
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        })}
      </div>
      <p className="text-sm">
        {comboMatch ? (
          <span className="font-semibold">{comboMatch}</span>
        ) : (
          <span className="text-muted-foreground">
            Выбери 3 специализации — название класса подставится само
          </span>
        )}
      </p>
    </div>
  );
}

function BuildView({
  slot,
  showLabel,
  archetype,
}: {
  slot: RoleSlot;
  showLabel: boolean;
  archetype: ArchetypeSlot;
}) {
  const specs = [
    archetype.specialization1,
    archetype.specialization2,
    archetype.specialization3,
  ];

  return (
    <div className="space-y-3">
      {showLabel && (
        <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {ROLE_LABELS[slot]}
        </div>
      )}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {specs.map((id, i) => {
          const spec = getSpecialization(id);
          if (!spec) {
            return (
              <div
                key={i}
                className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-4 text-sm text-muted-foreground"
              >
                Не выбрано
              </div>
            );
          }
          return (
            <div
              key={i}
              className="flex flex-col items-center gap-2 rounded-lg border p-4"
            >
              <div className="flex size-14 items-center justify-center rounded-md bg-muted">
                <SpecializationIcon id={spec.id} size={28} />
              </div>
              <div className="text-sm font-semibold">{spec.name}</div>
            </div>
          );
        })}
      </div>

      {archetype.className && (
        <div className="flex items-center justify-center">
          <Badge className="text-sm">{archetype.className}</Badge>
        </div>
      )}
    </div>
  );
}

export default function ClassArchetypeTab({
  userId,
  user,
  archetype,
  onChange,
  canEdit,
}: {
  userId: number;
  user: any;
  archetype: UserArchetype;
  onChange: (archetype: UserArchetype) => void;
  canEdit: boolean;
}) {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draft, setDraft] = useState<UserArchetype>(archetype);

  const activeSlots = ([1, 2, 3] as RoleSlot[]).filter((slot) =>
    hasRole(user, slot),
  );
  const showLabels = activeSlots.length > 1;

  const startEditing = () => {
    setDraft(archetype);
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
    setDraft(archetype);
  };

  const setSpec = (slot: RoleSlot, key: SpecKey, value: string) => {
    setDraft((prev) => ({
      ...prev,
      [slot]: { ...prev[slot], [key]: value === NONE ? null : value },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      let updated = archetype;
      for (const slot of activeSlots) {
        const slotDraft = draft[slot];
        updated = await saveUserArchetype(userId, slot, {
          specialization1: slotDraft.specialization1,
          specialization2: slotDraft.specialization2,
          specialization3: slotDraft.specialization3,
        });
      }
      onChange(updated);
      setEditing(false);
      toast.success("Класс сохранён");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Не удалось сохранить класс",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="flex items-center justify-between">
          Класс персонажа
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
      <CardContent className="space-y-6 pt-4">
        {editing && (
          <p className="text-sm text-muted-foreground">
            Класс собирается из 3 специализаций — название подставляется само
            по таблице сочетаний.
          </p>
        )}
        {activeSlots.map((slot, i) => (
          <div key={slot} className={i > 0 ? "border-t pt-4" : undefined}>
            {editing ? (
              <BuildEditor
                slot={slot}
                showLabel={showLabels}
                draft={draft[slot]}
                onSpecChange={(key, value) => setSpec(slot, key, value)}
              />
            ) : (
              <BuildView
                slot={slot}
                showLabel={showLabels}
                archetype={archetype[slot]}
              />
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
