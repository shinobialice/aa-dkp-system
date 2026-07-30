"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button, Input, Label } from "@/shared/ui";
import {
  getAttendanceBonusSettingsForSettings,
  updateAttendanceBonusSettings,
} from "@/actions/attendanceBonusSettings";
import type { AttendanceBonusSettingsRow } from "@/utils/attendanceBonusDefaults";

const FIELDS: {
  label: string;
  freeshardKey: keyof AttendanceBonusSettingsRow;
  pvpKey: keyof AttendanceBonusSettingsRow;
}[] = [
  { label: "ПВП", freeshardKey: "pvpPointsFreeshard", pvpKey: "pvpPointsPvp" },
  { label: "Прок", freeshardKey: "procPointsFreeshard", pvpKey: "procPointsPvp" },
  {
    label: "х2 Прок",
    freeshardKey: "doubleProcPointsFreeshard",
    pvpKey: "doubleProcPointsPvp",
  },
  {
    label: "ПВП > 30мин",
    freeshardKey: "pvpLongPointsFreeshard",
    pvpKey: "pvpLongPointsPvp",
  },
];

export function AttendanceBonusSettingsForm() {
  const [settings, setSettings] = useState<AttendanceBonusSettingsRow | null>(
    null,
  );
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getAttendanceBonusSettingsForSettings().then(setSettings);
  }, []);

  if (!settings) {
    return <p className="text-sm text-muted-foreground">Загрузка...</p>;
  }

  async function handleSave() {
    if (!settings) return;
    setSaving(true);
    try {
      await updateAttendanceBonusSettings(settings);
      toast.success("Бонусы за посещение сохранены");
    } catch {
      toast.error("Не удалось сохранить бонусы");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Бонусы за посещение</h2>

      <div className="grid grid-cols-[1fr_80px_80px] items-center gap-2 text-sm text-muted-foreground">
        <span></span>
        <span>Фришка</span>
        <span>ПВП</span>
      </div>

      <div className="space-y-2">
        {FIELDS.map(({ label, freeshardKey, pvpKey }) => (
          <div
            key={label}
            className="grid grid-cols-[1fr_80px_80px] items-center gap-2"
          >
            <Label>{label}</Label>
            <Input
              type="number"
              className="w-20"
              value={settings[freeshardKey]}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  [freeshardKey]: Number(e.target.value),
                })
              }
            />
            <Input
              type="number"
              className="w-20"
              value={settings[pvpKey]}
              onChange={(e) =>
                setSettings({ ...settings, [pvpKey]: Number(e.target.value) })
              }
            />
          </div>
        ))}
      </div>

      <Button onClick={handleSave} disabled={saving} className="cursor-pointer">
        {saving ? "Сохранение..." : "Сохранить"}
      </Button>
    </div>
  );
}
