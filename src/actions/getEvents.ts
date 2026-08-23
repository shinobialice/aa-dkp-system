"use server";

import sql from "@/shared/lib/db";

type Boss = {
  id: number;
  boss_name: string;
};

type Raid = {
  id: number;
  start_date: string;
  type: string;
  raid_boss: {
    boss: Boss;
  }[];
};

export const getRaids = async () => {
  let rows;
  try {
    rows = await sql<any[]>`
      SELECT r.id, r.start_date, r.type, b.id AS boss_id, b.boss_name AS boss_name
      FROM raid r
      LEFT JOIN raid_boss rb ON rb.raid_id = r.id
      LEFT JOIN boss b ON b.id = rb.boss_id
    `;
  } catch (error) {
    console.error("Ошибка при получении рейдов:", error);
    throw new Error("Не удалось загрузить рейды");
  }

  const raidMap = new Map<number, Raid>();
  for (const row of rows) {
    let raid = raidMap.get(row.id);
    if (!raid) {
      raid = { id: row.id, start_date: row.start_date, type: row.type, raid_boss: [] };
      raidMap.set(row.id, raid);
    }
    if (row.boss_id) {
      raid.raid_boss.push({ boss: { id: row.boss_id, boss_name: row.boss_name } });
    }
  }
  const raids = Array.from(raidMap.values());

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

      const title =
        raid.raid_boss
          ?.flatMap((rb) => rb.boss || [])
          .map((b) => b.boss_name)
          .filter(Boolean)
          .join(", ") || "Unknown Boss";

      // Морф/Марли Прок/Кошка — полноценные боссы, идут час, как Прайм.
      // 30 минут только у "чистого" АГЛ (фарм, без привязки к конкретному
      // боссу).
      const isAglBossFight = ["Морф", "Марли Прок", "Кошка"].some((name) =>
        title.includes(name),
      );
      const endMoment = new Date(Date.UTC(year, month - 1, day, hh, mm, ss));
      const durationMinutes =
        raid.type === "АГЛ" && !isAglBossFight ? 30 : 60;
      endMoment.setUTCMinutes(endMoment.getUTCMinutes() + durationMinutes);
      const endDatePart = endMoment.toISOString().slice(0, 10);
      const endTime = endMoment.toISOString().slice(11, 19);

      const start = raid.start_date;
      const end = `${endDatePart}T${endTime}`;

      let color = "gray";
      if (raid.type === "Прайм") color = "rgb(157, 41, 41)";
      if (raid.type === "АГЛ") color = "rgb(47, 158, 98)";
      if (title.includes("Кошка")) color = "rgb(215, 100, 168)";
      if (title.includes("Морф")) color = "rgb(40, 111, 180)";
      if (title.includes("Марли Прок")) color = "rgb(180, 108, 51)";
      if (title.includes("Анталлон")) color = "rgb(126, 34, 206)";
      if (title.includes("Корвус")) color = "rgb(178, 102, 236)";

      return {
        id: raid.id.toString(),
        title,
        start,
        end,
        color,
      };
    });
};
