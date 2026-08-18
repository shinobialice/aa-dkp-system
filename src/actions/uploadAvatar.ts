"use server";

import sql from "@/shared/lib/db";
import { saveUploadedFile } from "@/shared/lib/localStorage";
import { getSessionUserId } from "./getSessionUserId";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

export async function uploadAvatar(formData: FormData): Promise<string> {
  const sessionUserId = await getSessionUserId();
  if (!sessionUserId) {
    throw new Error("Не авторизован");
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    throw new Error("Файл не передан");
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Допустимы только изображения PNG, JPEG, WEBP или GIF");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Файл слишком большой (максимум 5 МБ)");
  }

  let publicUrl: string;
  try {
    publicUrl = await saveUploadedFile("avatars", `${sessionUserId}/avatar`, file);
  } catch (uploadError) {
    console.error("Failed to upload avatar:", uploadError);
    throw new Error("Не удалось загрузить аватар");
  }

  const avatarUrl = `${publicUrl}?t=${Date.now()}`;

  try {
    await sql<any[]>`
      UPDATE "user" SET avatar_url = ${avatarUrl} WHERE id = ${sessionUserId}
    `;
  } catch (updateError) {
    console.error("Failed to save avatar url:", updateError);
    throw new Error("Не удалось сохранить аватар");
  }

  return avatarUrl;
}
