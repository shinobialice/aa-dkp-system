"use server";

import supabase from "@/shared/lib/supabaseAdmin";
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

  const { data, error } = await supabase
    .from("loot")
    .select(
      `
      id,
      source,
      acquired_at,
      quantity,
      status,
      itemType: item_type ( id, name, price )
    `,
    )
    .is("raid_id", null)
    .eq("source", bossName)
    .gte("acquired_at", `${mskDay}T00:00:00`)
    .lt("acquired_at", `${nextDay}T00:00:00`)
    .order("acquired_at", { ascending: false });

  if (error || !data) {
    console.error("Ошибка при поиске непривязанного лута:", error);
    return [];
  }

  return data;
};
