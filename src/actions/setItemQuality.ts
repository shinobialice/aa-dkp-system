"use server";
import supabase from "@/shared/lib/supabaseAdmin";
import ensureCanEditUserData from "./ensureCanEditUserData";

const setItemQuality = async (itemId: number, quality: string) => {
  const { data: item } = await supabase
    .from("user_inventory")
    .select("user_id")
    .eq("id", itemId)
    .maybeSingle();

  if (!item) {
    throw new Error("Не удалось обновить качество предмета");
  }

  await ensureCanEditUserData(item.user_id, "inventoryEditEnabled");

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
