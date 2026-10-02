"use client";

import { Switch } from "@/shared/ui";
import {
  getUserSelfEditSettings,
  updateUserSelfEditSettings,
  type UserSelfEditSettings,
} from "@/actions/userSelfEditSettings";
import { useSettingsDraft } from "./settingsDraft";
import { Loading, SettingRow, SettingsCard } from "./settingsUi";

export const SELF_EDIT_DRAFT_ID = "selfEdit";

export const SELF_EDIT_FIELDS: {
  key: keyof UserSelfEditSettings;
  title: string;
  hint?: string;
}[] = [
  { key: "nicknameEditEnabled", title: "Ник" },
  { key: "gsEditEnabled", title: "ГС" },
  { key: "vkEditEnabled", title: "VK" },
  { key: "inventoryEditEnabled", title: "Инвентарь" },
  { key: "sealsEditEnabled", title: "Печати" },
  { key: "archetypeEditEnabled", title: "Класс (специализации)" },
  { key: "equipmentEditEnabled", title: "Экипировка" },
  {
    key: "extraRoleEditEnabled",
    title: "Доп. роли (добавление)",
    hint: "Добавить себе 2-ю/3-ю роль, если её ещё нет. ГС уже существующих ролей регулируется переключателем «ГС»",
  },
];

export function UserSelfEditSettingsForm() {
  const selfEdit = useSettingsDraft<UserSelfEditSettings>({
    id: SELF_EDIT_DRAFT_ID,
    section: "self",
    label: "Что игроки меняют сами",
    load: getUserSelfEditSettings,
    save: updateUserSelfEditSettings,
  });

  const s = selfEdit.value;
  if (!s) return <Loading />;

  return (
    <SettingsCard>
      {SELF_EDIT_FIELDS.map((field) => (
        <SettingRow
          key={field.key}
          title={field.title}
          hint={field.hint}
          changed={selfEdit.changed((v) => v[field.key])}
        >
          <Switch
            aria-label={field.title}
            checked={Boolean(s[field.key])}
            onCheckedChange={(checked) =>
              selfEdit.setValue((v) => ({ ...v, [field.key]: checked }))
            }
          />
        </SettingRow>
      ))}
    </SettingsCard>
  );
}
