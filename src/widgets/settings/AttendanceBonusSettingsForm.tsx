"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { X } from "lucide-react";
import { Button, Input, Label } from "@/shared/ui";
import {
  getAttendanceBonusTypesForSettings,
  createAttendanceBonusType,
  updateAttendanceBonusTypes,
  deleteAttendanceBonusType,
} from "@/actions/attendanceBonusSettings";
import { cn } from "@/shared/lib/tw-merge";
import { useSettingsDraft } from "./settingsDraft";
import { Loading, SettingsCard } from "./settingsUi";
import { getBossPointsForSettings } from "@/actions/bossPointsSettings";
import type { AttendanceBonusTypeRow } from "@/utils/attendanceBonusDefaults";
import ModeToggle from "./BonusModeToggle";
import BossScopePicker, { type BossOption } from "./BossScopePicker";

export function AttendanceBonusSettingsForm() {
  const bonuses = useSettingsDraft<AttendanceBonusTypeRow[]>({
    id: "attendanceBonuses",
    section: "points",
    label: "Бонусы за посещаемость",
    load: getAttendanceBonusTypesForSettings,
    save: (rows) =>
      updateAttendanceBonusTypes(
        rows.map((r) => ({
          id: r.id,
          label: r.label,
          modeFreeshard: r.modeFreeshard,
          modePvp: r.modePvp,
          valueFreeshard: r.valueFreeshard,
          valuePvp: r.valuePvp,
          bossIds: r.bossIds,
        })),
      ),
  });
  const [bosses, setBosses] = useState<BossOption[] | null>(null);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    getBossPointsForSettings()
      .then(setBosses)
      .catch(() => toast.error("Не удалось загрузить список боссов"));
  }, []);

  const rows = bonuses.value;
  if (!rows || !bosses) return <Loading />;

  function patchRow(id: number, patch: Partial<AttendanceBonusTypeRow>) {
    bonuses.setValue((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...patch } : r)),
    );
  }

  async function handleAdd() {
    setAdding(true);
    try {
      const row = await createAttendanceBonusType();
      bonuses.applySaved((prev) => [...prev, row]);
    } catch {
      toast.error("Не удалось добавить бонус");
    } finally {
      setAdding(false);
    }
  }

  async function handleDelete(id: number) {
    try {
      await deleteAttendanceBonusType(id);
      bonuses.applySaved((prev) => prev.filter((r) => r.id !== id));
    } catch {
      toast.error("Не удалось удалить бонус");
    }
  }

  return (
    <SettingsCard
      title="Бонусы за посещаемость"
      hint="прибавка или множитель к баллам"
      action={
        <Button
          variant="outline"
          size="sm"
          onClick={handleAdd}
          disabled={adding}
          className="cursor-pointer"
        >
          {adding ? "Добавление…" : "+ Добавить бонус"}
        </Button>
      }
    >
      {rows.length === 0 && (
        <p className="px-4 py-6 text-sm text-muted-foreground">
          Бонусов пока нет
        </p>
      )}
      {rows.map((r) => (
        <div
          key={r.id}
          className={cn(
            "space-y-2.5 px-4 py-3",
            bonuses.changed((all) => all.find((x) => x.id === r.id)) &&
              "bg-amber-50 dark:bg-amber-500/10",
          )}
        >
          <div className="flex items-center gap-2">
            <Input
              className="flex-1 font-medium"
              aria-label="Название бонуса"
              value={r.label}
              onChange={(e) => patchRow(r.id, { label: e.target.value })}
            />
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => handleDelete(r.id)}
              className="cursor-pointer text-muted-foreground"
              aria-label={`Удалить бонус «${r.label}»`}
              title="Удалить сразу"
            >
              <X className="size-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {(
              [
                ["Фришка", "valueFreeshard", "modeFreeshard"],
                ["ПВП", "valuePvp", "modePvp"],
              ] as const
            ).map(([title, valueKey, modeKey]) => (
              <div key={title} className="space-y-1">
                <Label className="text-xs text-muted-foreground">{title}</Label>
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    aria-label={`${r.label}, ${title}`}
                    className="flex-1"
                    value={r[valueKey]}
                    onChange={(e) =>
                      patchRow(r.id, { [valueKey]: Number(e.target.value) })
                    }
                  />
                  <ModeToggle
                    mode={r[modeKey]}
                    onChange={(mode) => patchRow(r.id, { [modeKey]: mode })}
                  />
                </div>
              </div>
            ))}
          </div>

          <BossScopePicker
            bosses={bosses}
            bossIds={r.bossIds}
            onChange={(bossIds) => patchRow(r.id, { bossIds })}
          />
        </div>
      ))}
    </SettingsCard>
  );
}
