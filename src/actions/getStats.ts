"use server";
import prisma from "@/lib/db";

const getStats = async () => {
  const users = await prisma.user.findMany({
    where: { active: true },
  });
  const stats = {
    activePlayers: users.length,
    dds: users.filter(
      (user) =>
        user.class?.includes("Милик") ||
        user.class?.includes("Лук") ||
        user.class?.includes("Маг")
    ).length,
    healers: users.filter((user) => user.class?.includes("Хил")).length,
    dancers: users.filter((user) => user.class?.includes("Танцор")).length,
    bards: users.filter((user) => user.class?.includes("Бард")).length,
    tacticians: users.filter((user) => user.class?.includes("Тактик")).length,
    recentMembers: await prisma.user.findMany({
      where: { active: true },
      orderBy: { joined_at: "desc" },
      take: 5,
      select: {
        id: true,
        username: true,
      },
    }),
  };

  return stats;
};

export default getStats;
