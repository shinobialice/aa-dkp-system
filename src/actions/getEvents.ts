"use server";

import { prisma } from "@/lib/db";

export const getRaids = async () => {
  const raids = await prisma.raid.findMany({
    include: {
      raidBosses: {
        include: {
          boss: true,
        },
      },
    },
  });

  return raids
    .filter((r) => r.start_date)
    .map((raid) => {
      const start = new Date(raid.start_date!);
      const end = new Date(start.getTime() + 60 * 60 * 1000);
      const title = raid.raidBosses.map((rb) => rb.boss.boss_name).join(", ");

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
