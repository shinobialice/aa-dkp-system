"use server";

import supabase from "@/shared/lib/supabaseAdmin";
import ensurePrivilieges from "./ensurePrivilieges";
import { revalidatePath } from "next/cache";

export type UserSelfEditSettings = {
  nicknameEditEnabled: boolean;
  gsEditEnabled: boolean;
  inventoryEditEnabled: boolean;
};

const DEFAULT_SETTINGS: UserSelfEditSettings = {
  nicknameEditEnabled: false,
  gsEditEnabled: false,
  inventoryEditEnabled: false,
};

export async function getUserSelfEditSettings(): Promise<UserSelfEditSettings> {
  const { data, error } = await supabase
    .from("user_self_edit_settings")
    .select("*")
    .eq("id", 1)
    .maybeSingle();

  if (error) {
    console.error(
      "Ошибка при получении настроек самостоятельного редактирования профиля:",
      error,
    );
    throw new Error("Не удалось загрузить настройки редактирования профиля");
  }

  if (!data) return DEFAULT_SETTINGS;

  return {
    nicknameEditEnabled: data.nickname_edit_enabled,
    gsEditEnabled: data.gs_edit_enabled,
    inventoryEditEnabled: data.inventory_edit_enabled,
  };
}

export async function updateUserSelfEditSettings(
  settings: UserSelfEditSettings,
) {
  await ensurePrivilieges(["Администратор"]);

  const { error } = await supabase.from("user_self_edit_settings").upsert({
    id: 1,
    nickname_edit_enabled: settings.nicknameEditEnabled,
    gs_edit_enabled: settings.gsEditEnabled,
    inventory_edit_enabled: settings.inventoryEditEnabled,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.error(
      "Ошибка при сохранении настроек самостоятельного редактирования профиля:",
      error,
    );
    throw new Error("Не удалось сохранить настройки редактирования профиля");
  }

  revalidatePath("/settings");
}
