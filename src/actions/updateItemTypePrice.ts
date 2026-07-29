"use server";
import supabase from "@/shared/lib/supabase";

export async function updateItemTypePrice(name: string, price: number | null) {
  const { error } = await supabase
    .from("item_type")
    .update({ price })
    .eq("name", name);

  if (error) {
    console.error("Ошибка при обновлении цены предмета:", error);
    throw new Error("Не удалось обновить цену");
  }
}
