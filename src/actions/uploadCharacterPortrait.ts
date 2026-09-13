"use server";

import sql from "@/shared/lib/db";
import { saveUploadedFile } from "@/shared/lib/localStorage";
import ensureCanEditUserData from "./ensureCanEditUserData";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];

export async function uploadCharacterPortrait(
  userId: number,
  formData: FormData,
): Promise<string> {
  await ensureCanEditUserData(userId, "equipmentEditEnabled");

  const file = formData.get("file");
  if (!(file instanceof File)) {
    throw new Error("Файл не передан");
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Допустимы только изображения PNG, JPEG или WEBP");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Файл слишком большой (максимум 5 МБ)");
  }

  let publicUrl: string;
  try {
    publicUrl = await saveUploadedFile(
      "character-portraits",
      `${userId}/portrait`,
      file,
    );
  } catch (uploadError) {
    console.error("Failed to upload character portrait:", uploadError);
    throw new Error("Не удалось загрузить скриншот");
  }

  const portraitUrl = `${publicUrl}?t=${Date.now()}`;

  try {
    await sql`
      UPDATE "user" SET character_portrait_url = ${portraitUrl} WHERE id = ${userId}
    `;
  } catch (updateError) {
    console.error("Failed to save character portrait url:", updateError);
    throw new Error("Не удалось сохранить скриншот");
  }

  return portraitUrl;
}
