"use server";

import supabase from "@/shared/lib/supabaseAdmin";
import {
  getMoscowISOString,
  parseMoscowISOString,
} from "@/utils/getMoscowISOString";

const CANDIDATE_WINDOW_DAYS = 3;

export const getRaidCandidatesForLoot = async ({
  source,
  acquiredAt,
}: {
  source?: string | null;
  acquiredAt?: string | null;
}) => {
  // acquiredAt (loot.acquired_at) — настоящий UTC instant. raid.start_date
  // хранится как naive МСК-строка (см. getMoscowISOString.ts), поэтому
  // границы окна тоже переводим в МСК-строку — иначе сравнение поплывёт
  // на таймзону сервера.
  const centerDate = acquiredAt ? new Date(acquiredAt) : new Date();

  const from = new Date(centerDate);
  from.setUTCDate(from.getUTCDate() - CANDIDATE_WINDOW_DAYS);
  const to = new Date(centerDate);
  to.setUTCDate(to.getUTCDate() + CANDIDATE_WINDOW_DAYS + 1);

  const { data, error } = await supabase
    .from("raid")
    .select("id, type, start_date, raid_boss(boss(boss_name))")
    .gte("start_date", getMoscowISOString(from))
    .lt("start_date", getMoscowISOString(to))
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
