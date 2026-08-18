"use server";
import sql from "@/shared/lib/db";

const getStats = async () => {
  let users;
  try {
    users = await sql<any[]>`
      SELECT id, username, class, joined_at FROM "user" WHERE active = true
    `;
  } catch (usersError) {
    console.error("Ошибка при загрузке пользователей:", usersError);
    throw new Error("Не удалось получить список пользователей");
  }

  const stats = {
    activePlayers: users.length,
    dds: users.filter(
      (user) =>
        user.class?.includes("Милик") ||
        user.class?.includes("Лук") ||
        user.class?.includes("Маг"),
    ).length,
    healers: users.filter((user) => user.class?.includes("Хил")).length,
    dancers: users.filter((user) => user.class?.includes("Танцор")).length,
    bards: users.filter((user) => user.class?.includes("Бард")).length,
    tacticians: users.filter((user) => user.class?.includes("Тактик")).length,
    recentMembers: users
      .filter((u) => u.joined_at)
      .sort(
        (a, b) =>
          new Date(b.joined_at!).getTime() - new Date(a.joined_at!).getTime(),
      )
      .slice(0, 5)
      .map((u) => ({ id: u.id, username: u.username })),
  };

  return stats;
};

export default getStats;
