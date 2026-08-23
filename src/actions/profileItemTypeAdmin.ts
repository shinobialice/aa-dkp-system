"use server";
import sql from "@/shared/lib/db";
import { saveUploadedFile } from "@/shared/lib/localStorage";
import ensurePrivilieges from "./ensurePrivilieges";
import { randomUUID } from "crypto";
import {
  PROFILE_ITEM_CATEGORIES,
  ProfileItemCategory,
} from "./profileItemCategories";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

export type ProfileItemTypeRow = {
  id: number;
  name: string;
  category: string;
  icon_url: string | null;
};

// Заводить/менять/удалять записи каталога "Другое" может только
// Администратор — общий на всю гильдию каталог не должен зарастать
// дублями/мусором от кого попало.
const CATALOG_EDITOR_TAGS = ["Администратор"];

// Дополнительные простые предметы инвентаря профиля (да/нет, без спецлогики) —
// не путать с фиксированным списком из 16 вещей в
// InventoryItems.tsx/InventoryIcons.tsx, тот не трогаем.
export async function getProfileItemTypes(): Promise<ProfileItemTypeRow[]> {
  return await sql<ProfileItemTypeRow[]>`
    SELECT id, name, category, icon_url FROM profile_item_type ORDER BY category, name
  `;
}

export async function createProfileItemType({
  name,
  category,
  iconUrl,
}: {
  name: string;
  category: string;
  iconUrl: string | null;
}) {
  await ensurePrivilieges(CATALOG_EDITOR_TAGS);
  const trimmed = name.trim();
  if (!trimmed) {
    throw new Error("Название предмета не может быть пустым");
  }
  if (!PROFILE_ITEM_CATEGORIES.includes(category as ProfileItemCategory)) {
    throw new Error("Некорректная категория");
  }
  try {
    await sql<any[]>`
      INSERT INTO profile_item_type (name, category, icon_url)
      VALUES (${trimmed}, ${category}, ${iconUrl})
    `;
  } catch (error: any) {
    console.error("Ошибка при создании предмета профиля:", error);
    if (error?.code === "23505") {
      throw new Error("Предмет с таким названием уже существует");
    }
    throw new Error("Не удалось создать предмет");
  }
}

export async function updateProfileItemType(
  id: number,
  {
    name,
    category,
    iconUrl,
  }: {
    name: string;
    category: string;
    iconUrl: string | null;
  },
) {
  await ensurePrivilieges(CATALOG_EDITOR_TAGS);
  const trimmed = name.trim();
  if (!trimmed) {
    throw new Error("Название предмета не может быть пустым");
  }
  if (!PROFILE_ITEM_CATEGORIES.includes(category as ProfileItemCategory)) {
    throw new Error("Некорректная категория");
  }
  try {
    await sql<any[]>`
      UPDATE profile_item_type
      SET name = ${trimmed}, category = ${category}, icon_url = ${iconUrl}
      WHERE id = ${id}
    `;
  } catch (error: any) {
    console.error("Ошибка при обновлении предмета профиля:", error);
    if (error?.code === "23505") {
      throw new Error("Предмет с таким названием уже существует");
    }
    throw new Error("Не удалось обновить предмет");
  }
}

export async function deleteProfileItemType(id: number) {
  await ensurePrivilieges(CATALOG_EDITOR_TAGS);

  const [row] = await sql<{ name: string; category: string }[]>`
    SELECT name, category FROM profile_item_type WHERE id = ${id}
  `;
  if (row) {
    const [used] = await sql<any[]>`
      SELECT 1 FROM user_inventory WHERE name = ${row.name} AND type = ${row.category} LIMIT 1
    `;
    if (used) {
      throw new Error(
        "Предмет уже отмечен у кого-то из игроков — удалить нельзя, можно только переименовать/изменить иконку",
      );
    }
  }

  try {
    await sql<any[]>`DELETE FROM profile_item_type WHERE id = ${id}`;
  } catch (error) {
    console.error("Ошибка при удалении предмета профиля:", error);
    throw new Error("Не удалось удалить предмет");
  }
}

export async function uploadProfileItemTypeIcon(
  formData: FormData,
): Promise<string> {
  await ensurePrivilieges(CATALOG_EDITOR_TAGS);

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
    // Имя файла — случайный UUID, путь и так уникален на каждую загрузку —
    // "?t=" не нужен (в отличие от аватарки/баннера с фиксированным путём) и
    // next/image (LootIcon) по умолчанию запрещает query string у локальных
    // картинок (images.localPatterns).
    return await saveUploadedFile("profile-item-icons", randomUUID(), file);
  } catch (error) {
    console.error("Failed to upload profile item icon:", error);
    throw new Error("Не удалось загрузить иконку");
  }
}
