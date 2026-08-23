"use server";
import sql from "@/shared/lib/db";
import { saveUploadedFile } from "@/shared/lib/localStorage";
import ensurePrivilieges from "./ensurePrivilieges";
import { randomUUID } from "crypto";

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
};

type ItemTypeInput = {
  name: string;
  price: number | null;
  iconUrl: string | null;
  grade: number;
  source: string | null;
  showInBuy: boolean;
};

// Служебные строки item_type — не обычные предметы лута, а завязанные по
// имени спецкейсы в других частях приложения (см. isOtherType в
// AddLootDialog, MISC_LOOT_ITEM_NAMES в MiscLootSummary): "В казну" — приход
// денег напрямую, "Всякие мелочи"/"Всякие мелочи 2" — помесячные сводки без
// поштучного учёта. Переименование или удаление сломало бы эти спецкейсы, а
// их собственная цена/иконка/грейд тут никак не используются — поэтому их
// прячем из общей таблицы редактирования и блокируем правки/удаление.
const UTILITY_ITEM_NAMES = ["В казну", "Всякие мелочи", "Всякие мелочи 2"];

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
    SELECT id, name, price, icon_url, grade, source, show_in_buy
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
}: ItemTypeInput) {
  await ensurePrivilieges(["Администратор"]);
  const trimmed = name.trim();
  if (!trimmed) {
    throw new Error("Название предмета не может быть пустым");
  }
  try {
    await sql<any[]>`
      INSERT INTO item_type (name, price, icon_url, grade, source, show_in_buy)
      VALUES (${trimmed}, ${price}, ${iconUrl}, ${grade}, ${source}, ${showInBuy})
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
  const { name, price, iconUrl, grade, source, showInBuy } = input;
  const trimmed = name.trim();
  if (!trimmed) {
    throw new Error("Название предмета не может быть пустым");
  }
  await assertNotUtilityItem(id);
  try {
    await sql<any[]>`
      UPDATE item_type
      SET name = ${trimmed}, price = ${price}, icon_url = ${iconUrl},
          grade = ${grade}, source = ${source}, show_in_buy = ${showInBuy}
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
