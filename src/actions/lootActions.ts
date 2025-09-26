"use server";

import supabase from "@/shared/lib/supabase";

// Get list of item types
export const getItemTypes = async () => {
  const { data, error } = await supabase.from("item_type").select("id, name");

  if (error || !data) {
    console.error("Ошибка при получении типов предметов:", error);
    throw new Error("Не удалось загрузить типы предметов");
  }

  return data;
};

// Get loot list with itemType
export async function getLoot() {
  const { data, error } = await supabase.from("loot").select(`
      *,
      itemType: item_type (
        id,
        name,
        price
      )
    `);

  if (error) {
    console.error("Ошибка при загрузке лута:", error);
    return [];
  }

  return data;
}

// Add loot item
export const addLootItem = async ({
  itemTypeId,
  source,
  acquired_at,
  quantity,
  status,
  sold_at,
}: {
  itemTypeId: number;
  source?: string;
  acquired_at: string;
  quantity?: number;
  status?: string;
  sold_at?: string;
}) => {
  const { error } = await supabase.from("loot").insert([
    {
      item_type_id: itemTypeId,
      status: status ?? "В наличии",
      sold_at: sold_at ?? null,
      source,
      acquired_at: new Date(acquired_at).toISOString(),
      quantity: quantity ?? 1,
      created_at: new Date().toISOString(),
    },
  ]);

  if (error) {
    console.error("Ошибка при добавлении лута:", error);
    throw new Error("Не удалось добавить предмет");
  }
};

// Get loot quantity by ID
export async function getLootQuantity(lootId: number) {
  const { data, error } = await supabase
    .from("loot")
    .select("quantity")
    .eq("id", lootId)
    .maybeSingle();

  if (error || !data) {
    console.error("Ошибка при получении количества лута:", error);
    return 0;
  }

  return data.quantity ?? 0;
}
