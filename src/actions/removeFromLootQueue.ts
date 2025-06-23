"use server";

import supabase from "@/lib/supabase";
import ensurePrivilieges from "./ensurePrivilieges";

export const removeFromLootQueue = async (id: number) => {
  await ensurePrivilieges(["Администратор"]);
  const { error } = await supabase.from("loot_queue").delete().eq("id", id);

  if (error) {
    console.error("Ошибка при удалении из очереди на лут:", error);
    throw new Error("Не удалось удалить запись из очереди");
  }
};
