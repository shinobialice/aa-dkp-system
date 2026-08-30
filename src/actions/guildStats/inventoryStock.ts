"use server";

import sql from "@/shared/lib/db";
import { getInventoryStockSettings } from "@/actions/inventoryStockSettings";
import { sortPlayers, type NamedPlayer } from "./playerRef";

export type InventoryStockStat = {
  label: string;
  count: number;
  iconUrl?: string | null;
  players: NamedPlayer[];
  // Отсутствует у "Бафалка" (см. NO_MISSING_LABELS) — для неё список
  // отсутствующих не показываем.
  missingPlayers?: NamedPlayer[];
};

// "Бафалка", драконы (Красный/Черный/Зеленый) и Авиара не показываем в
// списке отсутствующих — список "у кого нет" по ним не нужен.
const NO_MISSING_LABELS = new Set([
  "Бафалка (3 эпоха)",
  "Бафалка (4 эпоха)",
  "Бафалка (5 эпоха)",
  "Красный Дракон",
  "Черный Дракон",
  "Зеленый Дракон",
  "Авиара",
]);

// T1 -> T2: у T2-предмета обязателен T1 (это апгрейд), поэтому владельца T2
// не показываем повторно в списке "у кого есть" T1, а владение T2 засчитываем
// как владение T1 при подсчёте "у кого нет".
const T1_TO_T2_LABEL: Record<string, string> = {
  "Коллеционный глайдер": "Коллеционный глайдер (Т2)",
  "Коллекционный фамильяр": "Коллекционный фамильяр (Т2)",
  "Коллекционный пет": "Коллекционный пет (Т2)",
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
    SELECT id, username, class, active FROM "user"
  `.catch((error) => {
    console.error("Ошибка при получении пользователей:", error);
    throw new Error("Не удалось загрузить пользователей");
  });

  const activeUserIds = new Set(
    users.filter((u) => u.active).map((u) => u.id),
  );
  const playerById = new Map<number, NamedPlayer>(
    users.map((u) => [u.id, { username: u.username, class: u.class }]),
  );

  const ownersByLabel = new Map<string, Set<number>>();
  for (const { label, name, type, quality, excludeQuality } of sources) {
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
    ownersByLabel.set(label, owners);
  }

  const curatedStats = sources.map(({ label }) => {
    const owners = ownersByLabel.get(label)!;
    const t2Label = T1_TO_T2_LABEL[label];
    const t2Owners = t2Label ? (ownersByLabel.get(t2Label) ?? new Set()) : new Set<number>();

    const displayOwnerIds = t2Label
      ? [...owners].filter((id) => !t2Owners.has(id))
      : [...owners];
    const players = sortPlayers(
      displayOwnerIds.map((id) => playerById.get(id)).filter((p): p is NamedPlayer => !!p),
    );

    let missingPlayers: NamedPlayer[] | undefined;
    if (!NO_MISSING_LABELS.has(label)) {
      const countedOwnerIds = new Set([...owners, ...t2Owners]);
      missingPlayers = sortPlayers(
        [...activeUserIds]
          .filter((id) => !countedOwnerIds.has(id))
          .map((id) => playerById.get(id))
          .filter((p): p is NamedPlayer => !!p),
      );
    }

    return { label, count: owners.size, players, missingPlayers };
  });

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
      players: sortPlayers(
        [...owners].map((id) => playerById.get(id)).filter((p): p is NamedPlayer => !!p),
      ),
      missingPlayers: sortPlayers(
        [...activeUserIds]
          .filter((id) => !owners.has(id))
          .map((id) => playerById.get(id))
          .filter((p): p is NamedPlayer => !!p),
      ),
    }))
    .sort((a, b) => a.label.localeCompare(b.label, "ru"));

  return [...curatedStats, ...dynamicStats];
}
