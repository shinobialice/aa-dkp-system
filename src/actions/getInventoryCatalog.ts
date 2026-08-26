"use server";
import sql from "@/shared/lib/db";

export type OtherInventoryCatalogItem = {
  name: string;
  icon_url: string | null;
};

// Список предметов для поиска/выбора на вкладках инвентаря профиля, где
// добавление идёт через каталог (сейчас — "Глайдеры", "Петы", "Другое"), а
// не через фиксированный список (см. InventoryItems.tsx). Объединяет обе
// таблицы-каталога: item_type (казна/лут/покупка лута — уже заведено 60+
// предметов с иконками) и profile_item_type (предметы, заводимые отдельно
// под конкретную вкладку на /items, когда их нет в казне). Игроку не нужно
// вручную дублировать в profile_item_type то, что уже есть в казне — тут
// просто "всё, что есть в системе", по имени. При совпадении имени в обеих
// таблицах побеждает item_type (богаче данными).
export async function getInventoryCatalog(
  category: string,
): Promise<OtherInventoryCatalogItem[]> {
  return await sql<OtherInventoryCatalogItem[]>`
    SELECT DISTINCT ON (name) name, icon_url
    FROM (
      SELECT name, icon_url, 1 AS priority FROM item_type
      UNION ALL
      SELECT name, icon_url, 2 AS priority FROM profile_item_type WHERE category = ${category}
    ) combined
    ORDER BY name, priority
  `;
}
