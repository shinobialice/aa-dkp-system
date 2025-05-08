"use server";

import supabase from "@/lib/supabase";

export async function updateLootItem({
  id,
  quantity,
  source,
  acquired_at,
}: {
  id: number;
  quantity: number;
  source: string;
  acquired_at: Date;
}) {
  const { error } = await supabase
    .from("loot")
    .update({
      quantity,
      source,
      acquired_at: acquired_at.toISOString(),
    })
    .eq("id", id);

  if (error) {
    console.error("Ошибка при обновлении предмета:", error);
    throw new Error("Не удалось обновить предмет");
  }
}
