"use server";
import sql from "@/shared/lib/db";
import type { UserRow } from "@/shared/lib/dbTypes";

type StatsUser = Pick<UserRow, "id" | "username" | "class" | "joined_at">;

const DD_CLASSES = ["Милик", "Лук", "Маг", "Стрелок"];
const RECENT_MEMBERS_LIMIT = 5;

function countByClass(users: StatsUser[], ...names: string[]) {
  return users.filter((user) =>
    names.some((name) => user.class?.includes(name)),
  ).length;
}

const getStats = async () => {
  let users: StatsUser[];
  try {
    users = await sql<StatsUser[]>`
      SELECT id, username, class, joined_at FROM "user"
      WHERE active = true
        AND id NOT IN (SELECT user_id FROM user_tags WHERE tag = 'АФК' AND removed_at IS NULL)
    `;
  } catch (usersError) {
    console.error("Ошибка при загрузке пользователей:", usersError);
    throw new Error("Не удалось получить список пользователей");
  }

  const recentMembers = users
    .flatMap((user) =>
      user.joined_at ? [{ ...user, joinedAt: user.joined_at }] : [],
    )
    .sort((a, b) => b.joinedAt.localeCompare(a.joinedAt))
    .slice(0, RECENT_MEMBERS_LIMIT)
    .map((user) => ({ id: user.id, username: user.username }));

  return {
    activePlayers: users.length,
    dds: countByClass(users, ...DD_CLASSES),
    healers: countByClass(users, "Хил"),
    dancers: countByClass(users, "Танцор"),
    bards: countByClass(users, "Бард"),
    tacticians: countByClass(users, "Тактик"),
    recentMembers,
  };
};

export default getStats;
