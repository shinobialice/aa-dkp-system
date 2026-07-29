"use server";

import supabase from "@/shared/lib/supabaseAdmin";

const ONLINE_THRESHOLD_MS = 2 * 60 * 1000; // 2 минуты без heartbeat = не в сети

export async function getOnlineUsers() {
  const cutoff = new Date(Date.now() - ONLINE_THRESHOLD_MS).toISOString();

  const { data, error } = await supabase
    .from("user")
    .select("id, username")
    .gte("last_seen_at", cutoff)
    .order("username", { ascending: true });

  if (error) {
    console.error("Ошибка при получении онлайн-пользователей:", error);
    return [];
  }

  return data;
}
