"use client";

import { Input, Switch } from "@/shared/ui";
import {
  getSalaryEligibilitySettings,
  updateSalaryEligibilitySettings,
  type SalaryEligibilitySettings,
} from "@/actions/salaryEligibilitySettings";
import { useSettingsDraft } from "./settingsDraft";
import { Loading, SettingRow, SettingsCard, Unit } from "./settingsUi";

export const SALARY_DRAFT_ID = "salary";

export function SalaryEligibilitySettingsForm() {
  const salary = useSettingsDraft<SalaryEligibilitySettings>({
    id: SALARY_DRAFT_ID,
    section: "salary",
    label: "Зарплата",
    load: getSalaryEligibilitySettings,
    save: updateSalaryEligibilitySettings,
  });

  const s = salary.value;
  if (!s) return <Loading />;
  const set = (patch: Partial<SalaryEligibilitySettings>) =>
    salary.setValue((v) => ({ ...v, ...patch }));

  return (
    <SettingsCard title="Критерии выдачи зарплаты">
      <SettingRow
        title="По посещаемости праймов"
        hint="Получают те, у кого посещаемость праймов выше порога"
        changed={salary.changed((v) => [
          v.primeEnabled,
          v.primeThresholdPercent,
        ])}
      >
        <Unit>&gt;</Unit>
        <Input
          type="number"
          aria-label="Порог посещаемости праймов, %"
          className="w-20 text-right"
          disabled={!s.primeEnabled}
          value={s.primeThresholdPercent}
          onChange={(e) =>
            set({ primeThresholdPercent: Number(e.target.value) })
          }
        />
        <Unit>%</Unit>
        <Switch
          aria-label="Учитывать посещаемость праймов"
          checked={s.primeEnabled}
          onCheckedChange={(v) => set({ primeEnabled: v })}
        />
      </SettingRow>
      <SettingRow
        title="По учёту баллов"
        hint="Получают те, у кого доля баллов выше порога"
        changed={salary.changed((v) => [
          v.pointsEnabled,
          v.pointsThresholdPercent,
        ])}
      >
        <Unit>&gt;</Unit>
        <Input
          type="number"
          aria-label="Порог баллов, %"
          className="w-20 text-right"
          disabled={!s.pointsEnabled}
          value={s.pointsThresholdPercent}
          onChange={(e) =>
            set({ pointsThresholdPercent: Number(e.target.value) })
          }
        />
        <Unit>%</Unit>
        <Switch
          aria-label="Учитывать баллы"
          checked={s.pointsEnabled}
          onCheckedChange={(v) => set({ pointsEnabled: v })}
        />
      </SettingRow>
      <SettingRow
        title="Тег ДВ обходит пороги"
        hint="Игроки с тегом ДВ получают зарплату без порогов посещаемости и баллов"
        changed={salary.changed((v) => v.dvBypassEnabled)}
      >
        <Switch
          aria-label="Тег ДВ обходит пороги"
          checked={s.dvBypassEnabled}
          onCheckedChange={(v) => set({ dvBypassEnabled: v })}
        />
      </SettingRow>
      <SettingRow
        title="Порог ГС"
        hint="Проходной ГС по формуле гильдии. Тег ДВ его не обходит"
        changed={salary.changed((v) => v.gsEnabled)}
      >
        <Switch
          aria-label="Учитывать порог ГС"
          checked={s.gsEnabled}
          onCheckedChange={(v) => set({ gsEnabled: v })}
        />
      </SettingRow>
    </SettingsCard>
  );
}
