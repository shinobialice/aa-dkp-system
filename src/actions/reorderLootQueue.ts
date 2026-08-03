"use server";

import supabase from "@/shared/lib/supabaseAdmin";

export const reorderLootQueue = async (orderedIds: number[]) => {
  await Promise.all(
    orderedIds.map((id, index) =>
      supabase.from("loot_queue").update({ position: index }).eq("id", id),
    ),
  );
};
