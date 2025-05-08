"use server";
import supabase from "@/lib/supabase";

export async function deleteLootItem(id: number) {
  const { error } = await supabase.from("loot").delete().eq("id", id);

  if (error) {
    console.error("Failed to delete loot item:", error);
    throw new Error("Ошибка при удалении предмета");
  }
}
