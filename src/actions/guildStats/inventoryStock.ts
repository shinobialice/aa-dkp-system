"use server";

import supabase from "@/shared/lib/supabaseAdmin";

export type InventoryStockStat = {
  label: string;
  count: number;
};

const ITEM_SOURCES: {
  label: string;
  name: string;
  type?: string;
  quality?: string;
}[] = [
  { label: "Фрегат", name: "Фрегат", type: "Техника" },
  { label: "Кабуксон", name: "Кобуксон", type: "Техника" },
  { label: "Танк(любой)", name: "Танк", type: "Техника" },
  { label: "Канонерка", name: "Канонёрка", type: "Техника" },
  { label: "Баф фигура", name: "Бафалка", type: "Техника" },
  { label: "Колл. глайдер", name: "Коллеционный глайдер", type: "Глайдеры" },
  {
    label: "Колл. глайдер т2",
    name: "Коллеционный глайдер",
    type: "Глайдеры",
    quality: "4",
  },
  {
    label: "Колл. ездовой пет т2",
    name: "Коллекционный фамильяр т2 (ездовой)",
    type: "Петы",
  },
  { label: "ККЛ", name: "Крылья кровавого легиона", type: "Глайдеры" },
  { label: "Драк. глайдер", name: "Дракон", type: "Глайдеры" },
  { label: "Глайдер Авиары", name: "Авиара", type: "Глайдеры" },
  { label: "Колл. пет", name: "Коллекционный фамильяр", type: "Петы" },
  { label: "Дракон", name: "Дракон", type: "Петы" },
  { label: "Рокана", name: "Ро'кана, Безумие морей" },
  { label: "Кряк. щит", name: "Анд'хакар, Чернильная тьма" },
  {
    label: "Коллекционный фамильяр",
    name: "Коллекционный фамильяр",
    type: "Петы",
    quality: "4",
  },
];

export async function getInventoryStock(): Promise<InventoryStockStat[]> {
  const { data: inventory, error: inventoryError } = await supabase
    .from("user_inventory")
    .select("name, type, quality, user_id");

  if (inventoryError || !inventory) {
    console.error("Ошибка при получении инвентаря гильдии:", inventoryError);
    throw new Error("Не удалось загрузить инвентарь гильдии");
  }

  const { data: users, error: usersError } = await supabase
    .from("user")
    .select("id, active");

  if (usersError || !users) {
    console.error("Ошибка при получении пользователей:", usersError);
    throw new Error("Не удалось загрузить пользователей");
  }

  const activeUserIds = new Set(
    users.filter((u) => u.active).map((u) => u.id),
  );

  return ITEM_SOURCES.map(({ label, name, type, quality }) => {
    const owners = new Set(
      inventory
        .filter(
          (row) =>
            row.name === name &&
            (!type || row.type === type) &&
            (!quality || row.quality === quality) &&
            activeUserIds.has(row.user_id),
        )
        .map((row) => row.user_id),
    );
    return { label, count: owners.size };
  });
}
