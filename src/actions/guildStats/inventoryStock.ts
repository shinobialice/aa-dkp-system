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
  { label: "Фрегат", name: "Фрегат", type: "Техника" },
  { label: "Кабуксон", name: "Кобуксон", type: "Техника" },
  { label: "Танк(любой)", name: "Танк", type: "Техника" },
  { label: "Канонерка", name: "Канонёрка", type: "Техника" },
  {
    label: "Баф фигура 3 эпоха",
    name: "Бафалка",
    type: "Техника",
    quality: "3",
  },
  {
    label: "Баф фигура 4 эпоха",
    name: "Бафалка",
    type: "Техника",
    quality: "4",
  },
  {
    label: "Баф фигура 5 эпоха",
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
    label: "Коллеционный глайдер Т2",
    name: "Коллеционный глайдер",
    type: "Глайдеры",
    quality: "4",
  },
  { label: "ККЛ", name: "Крылья кровавого легиона", type: "Глайдеры" },
  { label: "Драк. глайдер", name: "Дракон", type: "Глайдеры" },
  { label: "Глайдер Авиары", name: "Авиара", type: "Глайдеры" },
  {
    label: "Паучья колония",
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
    label: "Коллекционный фамильяр Т2",
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
    label: "Коллекционный пет Т2",
    name: "Коллекционный пет",
    type: "Петы",
    quality: "4",
  },
  { label: "Красный Дракон", name: "Красный Дракон", type: "Петы" },
  { label: "Черный Дракон", name: "Черный Дракон", type: "Петы" },
  { label: "Зеленый Дракон", name: "Зеленый Дракон", type: "Петы" },
  { label: "Рокана", name: "Ро'кана, Безумие морей" },
  { label: "Кряк. щит", name: "Анд'хакар, Чернильная тьма" },
];

// Категории, где предметы добавляются через поиск по каталогу (см.
// getInventoryCatalog) — сюда со временем попадёт что угодно, поэтому
// вдобавок к вручную настроенным выше ITEM_SOURCES ниже считаем и то, что
// реально отмечено у игроков, но в список ещё не занесено.
const CATALOG_TYPES = ["Глайдеры", "Петы", "Другое"];

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

  const inventory = await sql<any[]>`
    SELECT name, type, quality, user_id FROM user_inventory
  `.catch((error) => {
    console.error("Ошибка при получении инвентаря гильдии:", error);
    throw new Error("Не удалось загрузить инвентарь гильдии");
  });

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
