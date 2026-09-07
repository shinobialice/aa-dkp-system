"use server";
import sql from "@/shared/lib/db";
import { saveUploadedFile } from "@/shared/lib/localStorage";
import ensurePrivilieges from "./ensurePrivilieges";
import { randomUUID } from "crypto";
import { UTILITY_ITEM_NAMES } from "@/shared/config/lootUtilityItems";

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];

export type ItemTypeRow = {
  id: number;
  name: string;
  price: number | null;
  icon_url: string | null;
  grade: number;
  source: string | null;
  show_in_buy: boolean;
  category: string | null;
};

type ItemTypeInput = {
  name: string;
  price: number | null;
  iconUrl: string | null;
  grade: number;
  source: string | null;
  showInBuy: boolean;
  category: string | null;
};

// UTILITY_ITEM_NAMES живёт в shared/config (см. комментарий там) — файл с
// "use server" не может экспортировать константу-массив, только async-функции.

async function assertNotUtilityItem(id: number) {
  const [row] = await sql<{ name: string }[]>`
    SELECT name FROM item_type WHERE id = ${id}
  `;
  if (row && UTILITY_ITEM_NAMES.includes(row.name)) {
    throw new Error(
      "Это служебный предмет, завязанный на логику казны/лута — его нельзя менять или удалять",
    );
  }
}

// Список используется на странице /items (таблица предметов) — с
// сортировкой по имени для удобства поиска в длинном списке (сама таблица
// умеет ещё и пересортировать/отфильтровать на клиенте).
export async function getItemTypesForAdmin(): Promise<ItemTypeRow[]> {
  await ensurePrivilieges(["Администратор"]);
  return await sql<ItemTypeRow[]>`
    SELECT id, name, price, icon_url, grade, source, show_in_buy, category
    FROM item_type
    WHERE name != ALL(${UTILITY_ITEM_NAMES})
    ORDER BY name
  `;
}

export async function createItemType({
  name,
  price,
  iconUrl,
  grade,
  source,
  showInBuy,
  category,
}: ItemTypeInput) {
  await ensurePrivilieges(["Администратор"]);
  const trimmed = name.trim();
  if (!trimmed) {
    throw new Error("Название предмета не может быть пустым");
  }
  try {
    await sql<any[]>`
      INSERT INTO item_type (name, price, icon_url, grade, source, show_in_buy, category)
      VALUES (${trimmed}, ${price}, ${iconUrl}, ${grade}, ${source}, ${showInBuy}, ${category})
    `;
  } catch (error: any) {
    console.error("Ошибка при создании предмета:", error);
    if (error?.code === "23505") {
      throw new Error("Предмет с таким названием уже существует");
    }
    throw new Error("Не удалось создать предмет");
  }
}

export async function updateItemType(id: number, input: ItemTypeInput) {
  await ensurePrivilieges(["Администратор"]);
  const { name, price, iconUrl, grade, source, showInBuy, category } = input;
  const trimmed = name.trim();
  if (!trimmed) {
    throw new Error("Название предмета не может быть пустым");
  }
  await assertNotUtilityItem(id);
  try {
    await sql<any[]>`
      UPDATE item_type
      SET name = ${trimmed}, price = ${price}, icon_url = ${iconUrl},
          grade = ${grade}, source = ${source}, show_in_buy = ${showInBuy},
          category = ${category}
      WHERE id = ${id}
    `;
  } catch (error: any) {
    console.error("Ошибка при обновлении предмета:", error);
    if (error?.code === "23505") {
      throw new Error("Предмет с таким названием уже существует");
    }
    throw new Error("Не удалось обновить предмет");
  }
}

export async function deleteItemType(id: number) {
  await ensurePrivilieges(["Администратор"]);
  await assertNotUtilityItem(id);
  try {
    await sql<any[]>`DELETE FROM item_type WHERE id = ${id}`;
  } catch (error: any) {
    console.error("Ошибка при удалении предмета:", error);
    if (error?.code === "23503") {
      throw new Error(
        "Предмет уже использован в луте — удалить нельзя, можно только переименовать/изменить иконку",
      );
    }
    throw new Error("Не удалось удалить предмет");
  }
}

export async function uploadItemTypeIcon(formData: FormData): Promise<string> {
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
    // Имя файла — случайный UUID, так что путь и так уникален на каждую
    // загрузку и не нуждается в "?t=" для сброса кэша браузера (в отличие
    // от аватарки/баннера ивента, где путь фиксирован). А next/image (см.
    // LootIcon) по умолчанию запрещает query string у локальных картинок
    // (images.localPatterns) — с "?t=" рендер иконки падал бы с ошибкой.
    return await saveUploadedFile("item-icons", randomUUID(), file);
  } catch (error) {
    console.error("Failed to upload item icon:", error);
    throw new Error("Не удалось загрузить иконку");
  }
}

// Для массовой перезаливки иконок (см. BulkIconUploadDialog на /items) —
// нужны ВСЕ предметы, включая служебные ("В казну" и т.п.), которые
// getItemTypesForAdmin скрывает из обычной таблицы: их иконку тоже можно
// перезалить (вся логика казны/лута завязана на name, не на icon_url), нужно
// только с чем сопоставлять файлы по имени.
export async function getIconMatchList(): Promise<
  { id: number; name: string; icon_url: string | null }[]
> {
  await ensurePrivilieges(["Администратор"]);
  return await sql<any[]>`
    SELECT id, name, icon_url FROM item_type ORDER BY id
  `;
}

// Точечно меняет только иконку — без assertNotUtilityItem/остальных полей,
// поэтому безопасно применять и к служебным предметам ("В казну" и т.п.):
// переименовать их этим нельзя, а любая логика казны/лута ключуется по name.
export async function setItemIconUrl(id: number, iconUrl: string): Promise<void> {
  await ensurePrivilieges(["Администратор"]);
  await sql<any[]>`UPDATE item_type SET icon_url = ${iconUrl} WHERE id = ${id}`;
}

// Рамки редкости (icon_grade1..12, см. GRADE_URL в LootIconComponent) — не
// строки item_type, а общий для всех иконок хардкод-константа с фиксированным
// именем файла на грейд (не UUID), чтобы путь оставался стабильным между
// перезаливками и не нужно было держать отдельную таблицу под 12 файлов.
export async function uploadGradeIcon(
  grade: number,
  formData: FormData,
): Promise<string> {
  await ensurePrivilieges(["Администратор"]);
  if (!Number.isInteger(grade) || grade < 1 || grade > 12) {
    throw new Error("Некорректный номер грейда");
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

  try {
    return await saveUploadedFile("grade-icons", `grade${grade}`, file);
  } catch (error) {
    console.error("Failed to upload grade icon:", error);
    throw new Error("Не удалось загрузить рамку редкости");
  }
}

// Иконка печати профиля (SEAL_ICON_URL в sealsData.ts) — одна на всё
// приложение (сама печать всегда одна и та же картинка, меняется только
// рамка грейда сверху — см. getSealGradeIconUrl/grade-icons), поэтому тоже
// фиксированное имя файла, как у рамок редкости.
export async function uploadSealIcon(formData: FormData): Promise<string> {
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
    return await saveUploadedFile("misc-icons", "seal-icon", file);
  } catch (error) {
    console.error("Failed to upload seal icon:", error);
    throw new Error("Не удалось загрузить иконку печати");
  }
}

// Общий "мусорный ящик" для любых других захардкоженных картинок с
// archeagecodex.com, которые не сидят ни в item_type, ни в списке грейдов/
// печати (см. BulkIconUploadDialog) — например фиксированный список из
// InventoryIcons.tsx. Имя файла на диске берём из его же исходного имени
// (без расширения) — предсказуемо и не нужно городить отдельную функцию под
// каждую новую картинку. name уже отфильтрован на клиенте, но раз он всё
// равно идёт в путь на диске — проверяем и здесь же, от path traversal.
export async function uploadMiscIcon(
  name: string,
  formData: FormData,
): Promise<string> {
  await ensurePrivilieges(["Администратор"]);
  if (!/^[a-zA-Z0-9_-]{1,100}$/.test(name)) {
    throw new Error("Некорректное имя файла");
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

  try {
    return await saveUploadedFile("misc-icons", name, file);
  } catch (error) {
    console.error("Failed to upload misc icon:", error);
    throw new Error("Не удалось загрузить иконку");
  }
}
