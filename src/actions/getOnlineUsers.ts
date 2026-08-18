"use server";

import sql from "@/shared/lib/db";

const ONLINE_THRESHOLD_MS = 2 * 60 * 1000; // 2 минуты без heartbeat = не в сети

// Порядок приоритета тэгов для сортировки/иконки в списке онлайна.
const rolePriority = ["Администратор", "Модератор", "Секретутка"];

export async function getOnlineUsers() {
  const cutoff = new Date(Date.now() - ONLINE_THRESHOLD_MS).toISOString();

  let data: { id: number; username: string; avatar_url: string | null }[];
  try {
    data = await sql<any[]>`
      SELECT id, username, avatar_url FROM "user"
      WHERE last_seen_at >= ${cutoff}
      ORDER BY username ASC
    `;
  } catch (error) {
    console.error("Ошибка при получении онлайн-пользователей:", error);
    return [];
  }

  if (data.length === 0) return [];

  const userIds = data.map((u) => u.id);
  let tagRows: { user_id: number; tag: string }[] = [];
  try {
    tagRows = await sql<any[]>`
      SELECT user_id, tag FROM user_tags
      WHERE user_id = ANY(${userIds})
        AND tag = ANY(${rolePriority})
        AND removed_at IS NULL
    `;
  } catch (tagError) {
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
