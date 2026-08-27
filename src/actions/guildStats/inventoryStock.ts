"use server";

import sql from "@/shared/lib/db";
import { getInventoryStockSettings } from "@/actions/inventoryStockSettings";

export type InventoryStockStat = {
  label: string;
  count: number;
  iconUrl?: string | null;
};

export type InventoryStockItem = {
  label: string;
  group: string;
};

const ITEM_SOURCES: {
  label: string;
  name: string;
  type?: string;
  quality?: string;
  excludeQuality?: string;
}[] = [
  // Лейблы ниже намеренно повторяют имя предмета так, как оно выглядит в
  // профиле на странице "Инвентарь игрока" (см. InventoryItems.tsx) — чтобы
  // одна и та же вещь называлась одинаково и там, и в статистике. Там, где
  // один профильный предмет разбит на несколько строк по quality (эпоха/T1-T2),
  // к имени добавлен уточняющий суффикс, само имя не меняется.
  { label: "Фрегат", name: "Фрегат", type: "Техника" },
  { label: "Кобуксон", name: "Кобуксон", type: "Техника" },
  { label: "Танк", name: "Танк", type: "Техника" },
  { label: "Канонерка", name: "Канонёрка", type: "Техника" },
  {
    label: "Бафалка (3 эпоха)",
    name: "Бафалка",
    type: "Техника",
    quality: "3",
  },
  {
    label: "Бафалка (4 эпоха)",
    name: "Бафалка",
    type: "Техника",
    quality: "4",
  },
  {
    label: "Бафалка (5 эпоха)",
    name: "Бафалка",
    type: "Техника",
    quality: "5",
  },
  {
    label: "Коллеционный глайдер",
    name: "Коллеционный глайдер",
    type: "Глайдеры",
    excludeQuality: "4",
  },
  {
    label: "Коллеционный глайдер (Т2)",
    name: "Коллеционный глайдер",
    type: "Глайдеры",
    quality: "4",
  },
  { label: "Крылья кровавого легиона", name: "Крылья кровавого легиона", type: "Глайдеры" },
  // Раньше здесь стояло { label: "Драк. глайдер", name: "Дракон", ... } —
  // "Дракон" и "Глайдер «Рассекатель небес»" оказались одним и тем же
  // предметом под разными именами (в БД уже слиты в одно имя), поэтому
  // достаточно одной записи под верным именем.
  {
    label: "Глайдер «Рассекатель небес»",
    name: "Глайдер «Рассекатель небес»",
    type: "Глайдеры",
  },
  { label: "Авиара", name: "Авиара", type: "Глайдеры" },
  {
    label: "Глайдер-крылья «Паучья колония»",
    name: "Глайдер-крылья «Паучья колония»",
    type: "Глайдеры",
  },
  {
    label: "Коллекционный фамильяр",
    name: "Коллекционный фамильяр",
    type: "Петы",
    excludeQuality: "4",
  },
  {
    label: "Коллекционный фамильяр (Т2)",
    name: "Коллекционный фамильяр",
    type: "Петы",
    quality: "4",
  },
  {
    label: "Коллекционный пет",
    name: "Коллекционный пет",
    type: "Петы",
    excludeQuality: "4",
  },
  {
    label: "Коллекционный пет (Т2)",
    name: "Коллекционный пет",
    type: "Петы",
    quality: "4",
  },
  { label: "Красный Дракон", name: "Красный Дракон", type: "Петы" },
  { label: "Черный Дракон", name: "Черный Дракон", type: "Петы" },
  { label: "Зеленый Дракон", name: "Зеленый Дракон", type: "Петы" },
  { label: "Ро'кана, Безумие морей", name: "Ро'кана, Безумие морей" },
  { label: "Анд'хакар, Чернильная тьма", name: "Анд'хакар, Чернильная тьма" },
];

// Категории, где предметы добавляются через поиск по каталогу (см.
// getInventoryCatalog) — сюда со временем попадёт что угодно, поэтому
// вдобавок к вручную настроенным выше ITEM_SOURCES ниже считаем и то, что
// реально отмечено у игроков, но в список ещё не занесено.
const CATALOG_TYPES = ["Глайдеры", "Петы", "Другое"];

// user_inventory.type хранит либо категорию профиля ("Техника"/"Глайдеры"/
// "Петы"/"Другое" — см. InventoryItemCard.tsx/addItemToUserInventory), либо
// статус "Выдано"/"Куплено" — записи, которые распределитель лута
// (distributeLootItems.ts) создаёт автоматически при продаже/выдаче предмета
// через "Раздачу лута". Статистика "Имеющиеся предметы" должна отражать
// только то, что игроки сами отметили у себя в профиле на странице
// "Инвентарь игрока" — распределённый через раздачу лута сюда попадать не
// должен (иначе, например, у записей без явного type в ITEM_SOURCES вроде
// "Ро'кана, Безумие морей"/"Анд'хакар, Чернильная тьма" счётчик
// задваивался и на лут, и на профиль).
const PROFILE_INVENTORY_TYPES = ["Техника", "Глайдеры", "Петы", "Другое"];

// Список предметов с группой для настроек (см. InventoryStockSettingsForm) —
// какие из них показывать на странице статистики.
export async function getInventoryStockItems(): Promise<InventoryStockItem[]> {
  return ITEM_SOURCES.map(({ label, type }) => ({
    label,
    group: type ?? "Прочее",
  }));
}

export async function getInventoryStock(): Promise<InventoryStockStat[]> {
  const { hiddenLabels } = await getInventoryStockSettings();
  const sources = ITEM_SOURCES.filter(
    (source) => !hiddenLabels.includes(source.label),
  );

  const inventory = (
    await sql<any[]>`
      SELECT name, type, quality, user_id FROM user_inventory
    `.catch((error) => {
      console.error("Ошибка при получении инвентаря гильдии:", error);
      throw new Error("Не удалось загрузить инвентарь гильдии");
    })
  ).filter((row) => PROFILE_INVENTORY_TYPES.includes(row.type));

  const users = await sql<any[]>`
    SELECT id, active FROM "user"
  `.catch((error) => {
    console.error("Ошибка при получении пользователей:", error);
    throw new Error("Не удалось загрузить пользователей");
  });

  const activeUserIds = new Set(
    users.filter((u) => u.active).map((u) => u.id),
  );

  const curatedStats = sources.map(
    ({ label, name, type, quality, excludeQuality }) => {
      const owners = new Set(
        inventory
          .filter(
            (row) =>
              row.name === name &&
              (!type || row.type === type) &&
              (!quality || row.quality === quality) &&
              (!excludeQuality || row.quality !== excludeQuality) &&
              activeUserIds.has(row.user_id),
          )
          .map((row) => row.user_id),
      );
      return { label, count: owners.size };
    },
  );

  // Всё остальное, что реально отмечено у игроков в категориях с каталогом,
  // но не входит в ITEM_SOURCES выше (например, только что заведённый в
  // казне/каталоге предмет, который кто-то уже отметил себе) — считаем по
  // имени напрямую из инвентаря, без ручной настройки.
  const curatedNames = new Set(ITEM_SOURCES.map((source) => source.name));
  const dynamicOwnersByName = new Map<string, Set<number>>();
  for (const row of inventory) {
    if (
      !CATALOG_TYPES.includes(row.type) ||
      curatedNames.has(row.name) ||
      hiddenLabels.includes(row.name) ||
      !activeUserIds.has(row.user_id)
    ) {
      continue;
    }
    if (!dynamicOwnersByName.has(row.name)) {
      dynamicOwnersByName.set(row.name, new Set());
    }
    dynamicOwnersByName.get(row.name)!.add(row.user_id);
  }

  const dynamicNames = Array.from(dynamicOwnersByName.keys());
  const catalogIcons = dynamicNames.length
    ? await sql<{ name: string; icon_url: string | null }[]>`
        SELECT DISTINCT ON (name) name, icon_url
        FROM (
          SELECT name, icon_url, 1 AS priority FROM item_type WHERE name = ANY(${dynamicNames})
          UNION ALL
          SELECT name, icon_url, 2 AS priority FROM profile_item_type WHERE name = ANY(${dynamicNames})
        ) combined
        ORDER BY name, priority
      `.catch(() => [])
    : [];
  const iconByName = new Map(catalogIcons.map((c) => [c.name, c.icon_url]));

  const dynamicStats = Array.from(dynamicOwnersByName.entries())
    .map(([label, owners]) => ({
      label,
      count: owners.size,
      iconUrl: iconByName.get(label) ?? null,
    }))
    .sort((a, b) => a.label.localeCompare(b.label, "ru"));

  return [...curatedStats, ...dynamicStats];
}
