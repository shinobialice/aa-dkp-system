"use server";

import sql from "@/shared/lib/db";
import ensurePrivilieges from "./ensurePrivilieges";
import { revalidatePath } from "next/cache";

export type UserSelfEditSettings = {
  nicknameEditEnabled: boolean;
  gsEditEnabled: boolean;
  inventoryEditEnabled: boolean;
  sealsEditEnabled: boolean;
  archetypeEditEnabled: boolean;
  extraRoleEditEnabled: boolean;
};

const DEFAULT_SETTINGS: UserSelfEditSettings = {
  nicknameEditEnabled: false,
  gsEditEnabled: false,
  inventoryEditEnabled: false,
  sealsEditEnabled: false,
  archetypeEditEnabled: false,
  extraRoleEditEnabled: false,
};

export async function getUserSelfEditSettings(): Promise<UserSelfEditSettings> {
  try {
    const [data] = await sql<any[]>`
      SELECT * FROM user_self_edit_settings WHERE id = 1
    `;

    if (!data) return DEFAULT_SETTINGS;

    return {
      nicknameEditEnabled: data.nickname_edit_enabled,
      gsEditEnabled: data.gs_edit_enabled,
      inventoryEditEnabled: data.inventory_edit_enabled,
      sealsEditEnabled: data.seals_edit_enabled,
      archetypeEditEnabled: data.archetype_edit_enabled,
      extraRoleEditEnabled: data.extra_role_edit_enabled,
    };
  } catch (error) {
    console.error(
      "Ошибка при получении настроек самостоятельного редактирования профиля:",
      error,
    );
    throw new Error("Не удалось загрузить настройки редактирования профиля");
  }
}

export async function updateUserSelfEditSettings(
  settings: UserSelfEditSettings,
) {
  await ensurePrivilieges(["Администратор"]);

  try {
    await sql<any[]>`
      INSERT INTO user_self_edit_settings
        (id, nickname_edit_enabled, gs_edit_enabled, inventory_edit_enabled, seals_edit_enabled, archetype_edit_enabled, extra_role_edit_enabled, updated_at)
      VALUES
        (1, ${settings.nicknameEditEnabled}, ${settings.gsEditEnabled}, ${settings.inventoryEditEnabled}, ${settings.sealsEditEnabled}, ${settings.archetypeEditEnabled}, ${settings.extraRoleEditEnabled}, now())
      ON CONFLICT (id) DO UPDATE SET
        nickname_edit_enabled = EXCLUDED.nickname_edit_enabled,
        gs_edit_enabled = EXCLUDED.gs_edit_enabled,
        inventory_edit_enabled = EXCLUDED.inventory_edit_enabled,
        seals_edit_enabled = EXCLUDED.seals_edit_enabled,
        archetype_edit_enabled = EXCLUDED.archetype_edit_enabled,
        extra_role_edit_enabled = EXCLUDED.extra_role_edit_enabled,
        updated_at = EXCLUDED.updated_at
    `;
  } catch (error) {
    console.error(
      "Ошибка при сохранении настроек самостоятельного редактирования профиля:",
      error,
    );
    throw new Error("Не удалось сохранить настройки редактирования профиля");
  }

  revalidatePath("/settings");
}
