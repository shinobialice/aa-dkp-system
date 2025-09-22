"use server";
import supabase from "@/shared/lib/supabase";

const getStats = async () => {
  // 1. Get all active users
  const { data: users, error: usersError } = await supabase
    .from("user")
    .select("id, username, class, joined_at")
    .eq("active", true);

  if (usersError || !users) {
    console.error("Ошибка при загрузке пользователей:", usersError);
    throw new Error("Не удалось получить список пользователей");
  }

  // 2. Filter stats
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
