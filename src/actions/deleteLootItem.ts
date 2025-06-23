"use server";
import supabase from "@/lib/supabase";
import ensurePrivilieges from "./ensurePrivilieges";

export async function deleteLootItem(id: number) {
  await ensurePrivilieges(["Администратор"]);
  const { error } = await supabase.from("loot").delete().eq("id", id);

  if (error) {
    console.error("Failed to delete loot item:", error);
    throw new Error("Ошибка при удалении предмета");
  }
}
