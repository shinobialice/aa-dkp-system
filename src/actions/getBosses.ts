"use server";

import supabase from "@/shared/lib/supabase";

export const getBosses = async () => {
  const { data: bosses, error } = await supabase
    .from("boss")
    .select("id, boss_name, dkp_points, category");

  if (error || !bosses) {
    console.error("Ошибка при получении списка боссов:", error);
    throw new Error("Не удалось загрузить боссов");
  }

  return bosses;
};
