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
      // raid.start_date хранится как naive-строка без таймзоны (например
      // "2026-07-06T19:30:00"). Строим end так же, наивно, без прогона
      // через new Date()/toISOString() — это меняет смысл времени в
      // зависимости от таймзоны сервера/браузера.
      const [datePart, timePart] = raid.start_date.split("T");
      const [year, month, day] = datePart.split("-").map(Number);
      const [hh, mm, ss] = timePart.split(":").map(Number);

      const endMoment = new Date(Date.UTC(year, month - 1, day, hh, mm, ss));
      endMoment.setUTCHours(endMoment.getUTCHours() + 1);
      const endDatePart = endMoment.toISOString().slice(0, 10);
      const endTime = endMoment.toISOString().slice(11, 19);

      const start = raid.start_date;
      const end = `${endDatePart}T${endTime}`;

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
        start,
        end,
        color,
      };
    });
};
