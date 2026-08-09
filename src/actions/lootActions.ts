"use server";

import supabase from "@/shared/lib/supabaseAdmin";
import { triggerFinanceRecalc } from "./recalculateFinanceForMonth";

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
  const { data, error } = await supabase
    .from("loot")
    .select(
      `
      *,
      itemType: item_type (
        id,
        name,
        price
      )
    `,
    )
    .order("acquired_at", { ascending: true });

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
  raidId,
}: {
  itemTypeId: number;
  source?: string;
  acquired_at: string;
  quantity?: number;
  status?: string;
  sold_at?: string;
  raidId?: number | null;
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
      raid_id: raidId ?? null,
    },
  ]);

  if (error) {
    console.error("Ошибка при добавлении лута:", error);
    throw new Error("Не удалось добавить предмет");
  }

  // "В казну"/"Продано" сразу с income (см. AddLootDialog — quick-add в
  // казну) — пересчитываем фонд месяца продажи, не дожидаясь таймера.
  if (sold_at && (status === "В казну" || status === "Продано")) {
    const soldAt = new Date(sold_at);
    await triggerFinanceRecalc(soldAt.getMonth() + 1, soldAt.getFullYear());
  }
};
