"use server";

import supabase from "@/lib/supabase";

export const getRaids = async () => {
  const { data: raids, error } = await supabase
    .from("raid")
    .select("id, start_date, type, raid_boss(boss(id, boss_name))");

  if (error || !raids) {
    console.error("Ошибка при получении рейдов:", error);
    throw new Error("Не удалось загрузить рейды");
  }

  return raids
    .filter((r) => r.start_date)
    .map((raid) => {
      const start = new Date(raid.start_date!);
      const end = new Date(start.getTime() + 60 * 60 * 1000);

      // raid.raid_boss: { boss: { id, boss_name }[] }[]
      const title =
        raid.raid_boss
          ?.map((rb) => rb.boss[0]?.boss_name) // <- take boss[0]
          .filter(Boolean) // drop any undefined
          .join(", ") || // join into string
        "Unknown Boss";

      let color = "gray";
      if (raid.type === "Прайм") color = "rgb(90, 54, 165)";
      if (raid.type === "АГЛ") color = "rgb(215, 100, 168)";
      if (title.includes("Кошка")) color = "rgb(232, 157, 53)";

      return {
        id: raid.id.toString(),
        title,
        start: start.toISOString(),
        end: end.toISOString(),
        color,
      };
    });
};
