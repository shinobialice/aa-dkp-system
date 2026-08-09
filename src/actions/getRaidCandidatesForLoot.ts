"use server";

import supabase from "@/shared/lib/supabaseAdmin";
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

  const { data, error } = await supabase
    .from("raid")
    .select("id, type, start_date, raid_boss(boss(boss_name))")
    .gte("start_date", `${day}T00:00:00`)
    .lt("start_date", `${nextDay}T00:00:00`)
    .order("start_date", { ascending: false });

  if (error || !data) {
    console.error("Ошибка при поиске рейдов для привязки лута:", error);
    return [];
  }

  const normalizedSource = (source ?? "").trim().toLowerCase();
  const centerTime = centerDate.getTime();

  return data
    .map((raid: any) => {
      const bossNames = (raid.raid_boss ?? [])
        .map((rb: any) => rb.boss?.boss_name)
        .filter(Boolean);
      const matchesBoss =
        normalizedSource.length > 0 &&
        bossNames.some(
          (name: string) => name.trim().toLowerCase() === normalizedSource,
        );
      return {
        id: raid.id,
        type: raid.type,
        start_date: raid.start_date,
        bossNames,
        matchesBoss,
      };
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
