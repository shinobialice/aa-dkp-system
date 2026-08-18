"use server";

import sql from "@/shared/lib/db";
import { parseMoscowISOString } from "@/utils/getMoscowISOString";

export const getRaidCandidatesForLoot = async ({
  source,
  acquiredAt,
}: {
  source?: string | null;
  acquiredAt?: string | null;
}) => {
  // Дата в казне (loot.acquired_at) всегда вводится день-в-день — ищем
  // рейды ровно в этот календарный день, без окна в несколько дней.
  // acquiredAt хранится как полночь UTC нужного дня, а raid.start_date —
  // как naive МСК-строка того же дня, так что сравниваем их календарные
  // дни напрямую по срезу строки, без конвертации таймзон.
  const centerDate = acquiredAt ? new Date(acquiredAt) : new Date();
  const day = centerDate.toISOString().slice(0, 10);
  const [y, m, d] = day.split("-").map(Number);
  const nextDay = new Date(Date.UTC(y, m - 1, d + 1)).toISOString().slice(0, 10);

  let rows;
  try {
    rows = await sql<any[]>`
      SELECT r.id, r.type, r.start_date, b.boss_name
      FROM raid r
      LEFT JOIN raid_boss rb ON rb.raid_id = r.id
      LEFT JOIN boss b ON b.id = rb.boss_id
      WHERE r.start_date >= ${day + "T00:00:00"} AND r.start_date < ${nextDay + "T00:00:00"}
      ORDER BY r.start_date DESC
    `;
  } catch (error) {
    console.error("Ошибка при поиске рейдов для привязки лута:", error);
    return [];
  }

  const raidMap = new Map<
    number,
    { id: number; type: string; start_date: string; bossNames: string[] }
  >();
  for (const row of rows) {
    let raid = raidMap.get(row.id);
    if (!raid) {
      raid = { id: row.id, type: row.type, start_date: row.start_date, bossNames: [] };
      raidMap.set(row.id, raid);
    }
    if (row.boss_name) raid.bossNames.push(row.boss_name);
  }

  const normalizedSource = (source ?? "").trim().toLowerCase();
  const centerTime = centerDate.getTime();

  return Array.from(raidMap.values())
    .map((raid) => {
      const matchesBoss =
        normalizedSource.length > 0 &&
        raid.bossNames.some(
          (name) => name.trim().toLowerCase() === normalizedSource,
        );
      return { ...raid, matchesBoss };
    })
    .sort((a, b) => {
      if (a.matchesBoss !== b.matchesBoss) return a.matchesBoss ? -1 : 1;
      const diffA = Math.abs(
        parseMoscowISOString(a.start_date).getTime() - centerTime,
      );
      const diffB = Math.abs(
        parseMoscowISOString(b.start_date).getTime() - centerTime,
      );
      return diffA - diffB;
    });
};
