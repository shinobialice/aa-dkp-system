"use server";

import sql from "@/shared/lib/db";

export type InventoryStockStat = {
  label: string;
  count: number;
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
  { label: "Красный Дракон", name: "Красный Дракон", type: "Петы" },
  { label: "Черный Дракон", name: "Черный Дракон", type: "Петы" },
  { label: "Зеленый Дракон", name: "Зеленый Дракон", type: "Петы" },
  { label: "Рокана", name: "Ро'кана, Безумие морей" },
  { label: "Кряк. щит", name: "Анд'хакар, Чернильная тьма" },
];

export async function getInventoryStock(): Promise<InventoryStockStat[]> {
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

  return ITEM_SOURCES.map(({ label, name, type, quality, excludeQuality }) => {
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
  });
}
