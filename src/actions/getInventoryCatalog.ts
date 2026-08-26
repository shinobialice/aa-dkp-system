"use server";
import sql from "@/shared/lib/db";

export type OtherInventoryCatalogItem = {
  name: string;
  icon_url: string | null;
};

// Список предметов для поиска/выбора на вкладках инвентаря профиля, где
// добавление идёт через каталог (сейчас — "Глайдеры", "Петы", "Другое"), а
// не через фиксированный список (см. InventoryItems.tsx). Объединяет обе
// таблицы-каталога: item_type (казна/лут/покупка лута) и profile_item_type
// (предметы, заводимые отдельно под конкретную вкладку на /items, когда их
// нет в казне). У обеих есть свой column "category" — большинство предметов
// казны (материалы, эссенции и т.п.) им не помечены (NULL) и в профиле не
// показываются вообще; в конкретную вкладку предмет попадает, только если
// админ явно поставил ему на /items соответствующую категорию. Игроку не
// нужно вручную дублировать в profile_item_type то, что уже есть в казне —
// тут просто "всё, что есть в системе с такой категорией", по имени. При
// совпадении имени в обеих таблицах побеждает item_type (богаче данными).
export async function getInventoryCatalog(
  category: string,
): Promise<OtherInventoryCatalogItem[]> {
  return await sql<OtherInventoryCatalogItem[]>`
    SELECT DISTINCT ON (name) name, icon_url
    FROM (
      SELECT name, icon_url, 1 AS priority FROM item_type WHERE category = ${category}
      UNION ALL
      SELECT name, icon_url, 2 AS priority FROM profile_item_type WHERE category = ${category}
    ) combined
    ORDER BY name, priority
  `;
}
