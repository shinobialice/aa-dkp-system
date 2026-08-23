"use server";
import sql from "@/shared/lib/db";

export type OtherInventoryCatalogItem = {
  name: string;
  icon_url: string | null;
};

// Список предметов для поиска/выбора на вкладке "Другое" в инвентаре
// профиля — объединяет обе таблицы-каталога: item_type (казна/лут/покупка
// лута — уже заведено 60+ предметов с иконками) и profile_item_type
// (предметы, заводимые отдельно под вкладку "Другое" на /items, когда их
// нет в казне). Игроку не нужно вручную дублировать в profile_item_type то,
// что уже есть в казне — тут просто "всё, что есть в системе", по имени.
// При совпадении имени в обеих таблицах побеждает item_type (богаче данными).
export async function getOtherInventoryCatalog(): Promise<
  OtherInventoryCatalogItem[]
> {
  return await sql<OtherInventoryCatalogItem[]>`
    SELECT DISTINCT ON (name) name, icon_url
    FROM (
      SELECT name, icon_url, 1 AS priority FROM item_type
      UNION ALL
      SELECT name, icon_url, 2 AS priority FROM profile_item_type WHERE category = 'Другое'
    ) combined
    ORDER BY name, priority
  `;
}
