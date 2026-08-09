"use server";

import supabase from "@/shared/lib/supabaseAdmin";

const CANDIDATE_WINDOW_DAYS = 3;

export const getUnlinkedLootCandidates = async ({
  bossName,
  date,
}: {
  bossName: string;
  date: string;
}) => {
  if (!bossName || !date) return [];

  const centerDate = new Date(date);
  const from = new Date(centerDate);
  from.setUTCDate(from.getUTCDate() - CANDIDATE_WINDOW_DAYS);
  const to = new Date(centerDate);
  to.setUTCDate(to.getUTCDate() + CANDIDATE_WINDOW_DAYS + 1);

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
    .gte("acquired_at", from.toISOString())
    .lt("acquired_at", to.toISOString())
    .order("acquired_at", { ascending: false });

  if (error || !data) {
    console.error("Ошибка при поиске непривязанного лута:", error);
    return [];
  }

  return data;
};
