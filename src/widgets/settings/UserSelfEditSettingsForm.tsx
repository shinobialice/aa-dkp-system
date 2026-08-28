"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button, Label, Switch } from "@/shared/ui";
import {
  getUserSelfEditSettings,
  updateUserSelfEditSettings,
  type UserSelfEditSettings,
} from "@/actions/userSelfEditSettings";

export function UserSelfEditSettingsForm() {
  const [settings, setSettings] = useState<UserSelfEditSettings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getUserSelfEditSettings().then(setSettings);
  }, []);

  if (!settings) {
    return <p className="text-sm text-muted-foreground">Загрузка...</p>;
  }

  async function handleSave() {
    if (!settings) return;
    setSaving(true);
    try {
      await updateUserSelfEditSettings(settings);
      toast.success("Настройки сохранены");
    } catch {
      toast.error("Не удалось сохранить настройки");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">
        Самостоятельное редактирование профиля
      </h2>
      <p className="text-sm text-muted-foreground">
        Разрешить активным пользователям менять эти поля в своём профиле без
        участия Администратора/Секретутки.
      </p>

      <div className="flex items-center justify-between gap-4 border rounded-lg p-3">
        <Label>Ник</Label>
        <Switch
          checked={settings.nicknameEditEnabled}
          onCheckedChange={(v) =>
            setSettings({ ...settings, nicknameEditEnabled: v })
          }
        />
      </div>

      <div className="flex items-center justify-between gap-4 border rounded-lg p-3">
        <Label>ГС</Label>
        <Switch
          checked={settings.gsEditEnabled}
          onCheckedChange={(v) =>
            setSettings({ ...settings, gsEditEnabled: v })
          }
        />
      </div>

      <div className="flex items-center justify-between gap-4 border rounded-lg p-3">
        <Label>Инвентарь</Label>
        <Switch
          checked={settings.inventoryEditEnabled}
          onCheckedChange={(v) =>
            setSettings({ ...settings, inventoryEditEnabled: v })
          }
        />
      </div>

      <div className="flex items-center justify-between gap-4 border rounded-lg p-3">
        <Label>Печати</Label>
        <Switch
          checked={settings.sealsEditEnabled}
          onCheckedChange={(v) =>
            setSettings({ ...settings, sealsEditEnabled: v })
          }
        />
      </div>

      <div className="flex items-center justify-between gap-4 border rounded-lg p-3">
        <Label>Класс (специализации)</Label>
        <Switch
          checked={settings.archetypeEditEnabled}
          onCheckedChange={(v) =>
            setSettings({ ...settings, archetypeEditEnabled: v })
          }
        />
      </div>

      <div className="flex items-center justify-between gap-4 border rounded-lg p-3">
        <div>
          <Label>Доп. роли (добавление)</Label>
          <p className="text-xs text-muted-foreground">
            Разрешает добавить себе 2-ю/3-ю роль, если её ещё нет. Изменение
            ГС уже существующих ролей отдельно регулируется тумблером «ГС».
          </p>
        </div>
        <Switch
          checked={settings.extraRoleEditEnabled}
          onCheckedChange={(v) =>
            setSettings({ ...settings, extraRoleEditEnabled: v })
          }
        />
      </div>

      <Button
        onClick={handleSave}
        disabled={saving}
        className="cursor-pointer"
      >
        {saving ? "Сохранение..." : "Сохранить"}
      </Button>
    </div>
  );
}
