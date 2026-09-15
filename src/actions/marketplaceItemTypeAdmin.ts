"use server";
import sql from "@/shared/lib/db";
import { saveUploadedFile } from "@/shared/lib/localStorage";
import ensurePrivilieges from "./ensurePrivilieges";
import { randomUUID } from "crypto";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

export type MarketplaceItemTypeRow = {
  id: number;
  name: string;
  icon_url: string | null;
};

// Отдельный каталог "название + иконка" под доску объявлений — не путать с
// item_type (казна/лут/покупка лута). Управляется на вкладке "Доска
// объявлений" на /items. Чтение доступно любому авторизованному участнику
// (нужно всем при создании объявления), запись — только админам.
export async function getMarketplaceItemTypes(): Promise<MarketplaceItemTypeRow[]> {
  return await sql<MarketplaceItemTypeRow[]>`
    SELECT id, name, icon_url FROM marketplace_item_type ORDER BY name
  `;
}

export async function createMarketplaceItemType({
  name,
  iconUrl,
}: {
  name: string;
  iconUrl: string | null;
}) {
  await ensurePrivilieges(["Администратор"]);
  const trimmed = name.trim();
  if (!trimmed) {
    throw new Error("Название предмета не может быть пустым");
  }
  try {
    await sql`
      INSERT INTO marketplace_item_type (name, icon_url)
      VALUES (${trimmed}, ${iconUrl})
    `;
  } catch (error: any) {
    console.error("Ошибка при создании предмета доски объявлений:", error);
    if (error?.code === "23505") {
      throw new Error("Предмет с таким названием уже существует");
    }
    throw new Error("Не удалось создать предмет");
  }
}

export async function updateMarketplaceItemType(
  id: number,
  { name, iconUrl }: { name: string; iconUrl: string | null },
) {
  await ensurePrivilieges(["Администратор"]);
  const trimmed = name.trim();
  if (!trimmed) {
    throw new Error("Название предмета не может быть пустым");
  }
  try {
    await sql`
      UPDATE marketplace_item_type
      SET name = ${trimmed}, icon_url = ${iconUrl}
      WHERE id = ${id}
    `;
  } catch (error: any) {
    console.error("Ошибка при обновлении предмета доски объявлений:", error);
    if (error?.code === "23505") {
      throw new Error("Предмет с таким названием уже существует");
    }
    throw new Error("Не удалось обновить предмет");
  }
}

export async function deleteMarketplaceItemType(id: number) {
  await ensurePrivilieges(["Администратор"]);
  try {
    await sql`DELETE FROM marketplace_item_type WHERE id = ${id}`;
  } catch (error: any) {
    console.error("Ошибка при удалении предмета доски объявлений:", error);
    if (error?.code === "23503") {
      throw new Error(
        "Предмет уже используется в объявлениях — удалить нельзя, можно только переименовать/изменить иконку",
      );
    }
    throw new Error("Не удалось удалить предмет");
  }
}

export async function uploadMarketplaceItemTypeIcon(
  formData: FormData,
): Promise<string> {
  await ensurePrivilieges(["Администратор"]);

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

  try {
    return await saveUploadedFile("marketplace-item-icons", randomUUID(), file);
  } catch (error) {
    console.error("Failed to upload marketplace item icon:", error);
    throw new Error("Не удалось загрузить иконку");
  }
}
