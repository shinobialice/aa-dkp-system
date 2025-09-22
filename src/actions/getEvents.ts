"use server";

import supabase from "@/shared/lib/supabase";

type Boss = {
  id: number;
  boss_name: string;
};

type Raid = {
  id: number;
  start_date: string;
  type: string;
  raid_boss: {
    boss: Boss[];
  }[];
};

export const getRaids = async () => {
  const { data, error } = await supabase.from("raid").select(`
    id,
    start_date,
    type,
    raid_boss(
      boss:boss_id(
        id,
        boss_name
      )
    )
  `);

  if (error || !data) {
    console.error("Ошибка при получении рейдов:", error);
    throw new Error("Не удалось загрузить рейды");
  }

  const raids = data as unknown as Raid[];

  return raids
    .filter((r) => r.start_date)
    .map((raid) => {
      const start = new Date(raid.start_date);
      const end = new Date(start.getTime() + 60 * 60 * 1000);

      const title =
        raid.raid_boss
          ?.flatMap((rb) => rb.boss || [])
          .map((b) => b.boss_name)
          .filter(Boolean)
          .join(", ") || "Unknown Boss";

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
