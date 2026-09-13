"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";
import { Button, Checkbox, Input, Label } from "@/shared/ui";
import {
  getAttendanceBonusTypesForSettings,
  createAttendanceBonusType,
  updateAttendanceBonusTypes,
  deleteAttendanceBonusType,
} from "@/actions/attendanceBonusSettings";
import { getBossPointsForSettings } from "@/actions/bossPointsSettings";
import type {
  AttendanceBonusMode,
  AttendanceBonusTypeRow,
} from "@/utils/attendanceBonusDefaults";

const CATEGORY_ORDER = ["Прайм", "АГЛ"];
const AGL_BOSS_ORDER = ["АГЛ", "Морф", "Марли Прок", "Кошка"];

type BossOption = { id: number; boss_name: string; category: string };

function ModeToggle({
  mode,
  onChange,
}: {
  mode: AttendanceBonusMode;
  onChange: (mode: AttendanceBonusMode) => void;
}) {
  return (
    <div className="flex overflow-hidden rounded-md border">
      <button
        type="button"
        className={`w-7 cursor-pointer text-sm ${mode === "add" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
        onClick={() => onChange("add")}
        title="Прибавить балл"
      >
        +
      </button>
      <button
        type="button"
        className={`w-7 cursor-pointer border-l text-sm ${mode === "multiply" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
        onClick={() => onChange("multiply")}
        title="Умножить на значение"
      >
        ×
      </button>
    </div>
  );
}

function BossScopePicker({
  bosses,
  bossIds,
  onChange,
}: {
  bosses: BossOption[];
  bossIds: number[];
  onChange: (bossIds: number[]) => void;
}) {
  return (
    <div className="space-y-2">
      {CATEGORY_ORDER.map((category) => {
        const categoryBosses = bosses
          .filter((b) => b.category === category)
          .sort((a, b) => {
            if (category !== "АГЛ") return 0;
            return (
              AGL_BOSS_ORDER.indexOf(a.boss_name) -
              AGL_BOSS_ORDER.indexOf(b.boss_name)
            );
          });
        if (categoryBosses.length === 0) return null;

        const allSelected = categoryBosses.every((b) => bossIds.includes(b.id));

        function toggleAll(checked: boolean) {
          const others = bossIds.filter(
            (id) => !categoryBosses.some((b) => b.id === id),
          );
          onChange(checked ? [...others, ...categoryBosses.map((b) => b.id)] : others);
        }

        function toggleBoss(bossId: number, checked: boolean) {
          onChange(
            checked
              ? [...bossIds, bossId]
              : bossIds.filter((id) => id !== bossId),
          );
        }

        return (
          <div key={category} className="rounded-md border p-2">
            <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
              <Checkbox
                className="cursor-pointer"
                checked={allSelected}
                onCheckedChange={(checked) => toggleAll(checked === true)}
              />
              {category}
            </label>
            <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 pl-6 text-sm text-muted-foreground">
              {categoryBosses.map((b) => (
                <label
                  key={b.id}
                  className="flex cursor-pointer items-center gap-2"
                >
                  <Checkbox
                    className="cursor-pointer"
                    checked={bossIds.includes(b.id)}
                    onCheckedChange={(checked) =>
                      toggleBoss(b.id, checked === true)
                    }
                  />
                  {b.boss_name}
                </label>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function AttendanceBonusSettingsForm() {
  const [rows, setRows] = useState<AttendanceBonusTypeRow[] | null>(null);
  const [bosses, setBosses] = useState<BossOption[] | null>(null);
  const [saving, setSaving] = useState(false);
  const [adding, setAdding] = useState(false);

  function reload() {
    getAttendanceBonusTypesForSettings().then(setRows);
  }

  useEffect(() => {
    reload();
    getBossPointsForSettings().then(setBosses);
  }, []);

  if (!rows || !bosses) {
    return <p className="text-sm text-muted-foreground">Загрузка...</p>;
  }

  function patchRow(id: number, patch: Partial<AttendanceBonusTypeRow>) {
    setRows(
      (prev) => prev?.map((r) => (r.id === id ? { ...r, ...patch } : r)) ?? null,
    );
  }

  async function handleAdd() {
    setAdding(true);
    try {
      const row = await createAttendanceBonusType();
      setRows((prev) => [...(prev ?? []), row]);
    } catch {
      toast.error("Не удалось добавить бонус");
    } finally {
      setAdding(false);
    }
  }

  async function handleDelete(id: number) {
    setRows((prev) => prev?.filter((r) => r.id !== id) ?? null);
    try {
      await deleteAttendanceBonusType(id);
    } catch {
      toast.error("Не удалось удалить бонус");
      reload();
    }
  }

  async function handleSave() {
    if (!rows) return;
    setSaving(true);
    try {
      await updateAttendanceBonusTypes(
        rows.map((r) => ({
          id: r.id,
          label: r.label,
          modeFreeshard: r.modeFreeshard,
          modePvp: r.modePvp,
          valueFreeshard: r.valueFreeshard,
          valuePvp: r.valuePvp,
          bossIds: r.bossIds,
        })),
      );
      toast.success("Баллы за посещаемость сохранены");
    } catch {
      toast.error("Не удалось сохранить бонусы");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Баллы за посещаемость</h2>

      <div className="space-y-3">
        {rows.map((r) => (
          <div key={r.id} className="space-y-2 rounded-lg border p-3">
            <div className="flex items-center gap-2">
              <Input
                className="flex-1"
                value={r.label}
                onChange={(e) => patchRow(r.id, { label: e.target.value })}
              />
              <button
                onClick={() => handleDelete(r.id)}
                className="cursor-pointer text-muted-foreground hover:text-foreground"
                aria-label="Удалить"
                title="Удалить"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">
                  Фришка
                </Label>
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    className="flex-1"
                    value={r.valueFreeshard}
                    onChange={(e) =>
                      patchRow(r.id, { valueFreeshard: Number(e.target.value) })
                    }
                  />
                  <ModeToggle
                    mode={r.modeFreeshard}
                    onChange={(modeFreeshard) => patchRow(r.id, { modeFreeshard })}
                  />
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">ПВП</Label>
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    className="flex-1"
                    value={r.valuePvp}
                    onChange={(e) =>
                      patchRow(r.id, { valuePvp: Number(e.target.value) })
                    }
                  />
                  <ModeToggle
                    mode={r.modePvp}
                    onChange={(modePvp) => patchRow(r.id, { modePvp })}
                  />
                </div>
              </div>
            </div>

            <BossScopePicker
              bosses={bosses}
              bossIds={r.bossIds}
              onChange={(bossIds) => patchRow(r.id, { bossIds })}
            />
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          onClick={handleAdd}
          disabled={adding}
          className="cursor-pointer"
        >
          {adding ? "Добавление..." : "Добавить бонус"}
        </Button>
        <Button onClick={handleSave} disabled={saving} className="cursor-pointer">
          {saving ? "Сохранение..." : "Сохранить"}
        </Button>
      </div>
    </div>
  );
}
