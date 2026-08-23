"use server";

import sql from "@/shared/lib/db";
import { getMoscowISOString } from "@/utils/getMoscowISOString";

export const getUnlinkedLootCandidates = async ({
  bossName,
  date,
}: {
  bossName: string;
  date: string;
}) => {
  if (!bossName || !date) return [];

  // Дата в казне (loot.acquired_at) всегда вводится день-в-день — берём
  // ровно тот календарный день рейда по МСК, без окна в несколько дней.
  const mskDay = getMoscowISOString(new Date(date)).slice(0, 10);
  const [y, m, d] = mskDay.split("-").map(Number);
  const nextDay = new Date(Date.UTC(y, m - 1, d + 1)).toISOString().slice(0, 10);

  try {
    const rows = await sql<any[]>`
      SELECT
        l.id, l.source, l.acquired_at, l.quantity, l.status,
        it.id AS item_type_pk, it.name AS item_type_name, it.price AS item_type_price,
        it.icon_url AS item_type_icon_url, it.grade AS item_type_grade
      FROM loot l
      JOIN item_type it ON it.id = l.item_type_id
      WHERE l.raid_id IS NULL
        AND l.source = ${bossName}
        AND l.acquired_at >= ${mskDay + "T00:00:00"}
        AND l.acquired_at < ${nextDay + "T00:00:00"}
      ORDER BY l.acquired_at DESC
    `;

    return rows.map((row) => {
      const {
        item_type_pk,
        item_type_name,
        item_type_price,
        item_type_icon_url,
        item_type_grade,
        ...loot
      } = row;
      return {
        ...loot,
        itemType: {
          id: item_type_pk,
          name: item_type_name,
          price: item_type_price,
          icon_url: item_type_icon_url,
          grade: item_type_grade,
        },
      };
    });
  } catch (error) {
    console.error("Ошибка при поиске непривязанного лута:", error);
    return [];
  }
};
