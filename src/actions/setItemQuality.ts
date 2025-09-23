"use server";
import supabase from "@/shared/lib/supabase";

const setItemQuality = async (itemId: number, quality: string) => {
  const { data, error } = await supabase
    .from("user_inventory")
    .update({ quality })
    .eq("id", itemId)
    .select()
    .maybeSingle();

  if (error || !data) {
    console.error("Ошибка при обновлении качества предмета:", error);
    throw new Error("Не удалось обновить качество предмета");
  }

  return data;
};

export default setItemQuality;
