"use server";

import supabase from "@/shared/lib/supabase";

export async function updateLastSeen(userId: number) {
  await supabase
    .from("user")
    .update({ last_seen_at: new Date().toISOString() })
    .eq("id", userId);
}
