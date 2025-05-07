"use server";
import prisma from "@/lib/db";

export async function getAverageGuildGS() {
  const users = await prisma.user.findMany({
    where: {
      active: true,
      class_gear_score: { not: null },
    },
    select: { class_gear_score: true },
  });

  if (users.length === 0) {return 0;}

  const sum = users.reduce((acc, u) => acc + (u.class_gear_score ?? 0), 0);
  const avg = sum / users.length;

  return Math.floor(avg / 500) * 500;
}
