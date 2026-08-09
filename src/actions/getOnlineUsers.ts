"use server";

import supabase from "@/shared/lib/supabaseAdmin";

const ONLINE_THRESHOLD_MS = 2 * 60 * 1000; // 2 минуты без heartbeat = не в сети

// Порядок приоритета тэгов для сортировки/иконки в списке онлайна.
const rolePriority = ["Администратор", "Модератор", "Секретутка"];

export async function getOnlineUsers() {
  const cutoff = new Date(Date.now() - ONLINE_THRESHOLD_MS).toISOString();

  const { data, error } = await supabase
    .from("user")
    .select("id, username, avatar_url")
    .gte("last_seen_at", cutoff)
    .order("username", { ascending: true });

  if (error) {
    console.error("Ошибка при получении онлайн-пользователей:", error);
    return [];
  }

  if (data.length === 0) return [];

  const { data: tagRows, error: tagError } = await supabase
    .from("user_tags")
    .select("user_id, tag")
    .in(
      "user_id",
      data.map((u) => u.id),
    )
    .in("tag", rolePriority)
    .is("removed_at", null);

  if (tagError) {
    console.error("Ошибка при получении тэгов онлайн-пользователей:", tagError);
  }

  const roleByUserId = new Map<number, string>();
  for (const row of tagRows ?? []) {
    const current = roleByUserId.get(row.user_id);
    if (
      !current ||
      rolePriority.indexOf(row.tag) < rolePriority.indexOf(current)
    ) {
      roleByUserId.set(row.user_id, row.tag);
    }
  }

  const users = data.map((u) => ({
    ...u,
    role: roleByUserId.get(u.id) ?? null,
  }));

  users.sort((a, b) => {
    const aPriority = a.role ? rolePriority.indexOf(a.role) : rolePriority.length;
    const bPriority = b.role ? rolePriority.indexOf(b.role) : rolePriority.length;
    if (aPriority !== bPriority) return aPriority - bPriority;
    return a.username.localeCompare(b.username);
  });

  return users;
}
