"use server";

import { prisma } from "@/lib/db";

export async function getEligibleUsers() {
  const users = await prisma.user.findMany({
    where: {
      googleId: null,
      active: true,
    },
    select: {
      id: true,
      username: true,
    },
    orderBy: {
      username: "asc",
    },
  });

  return users;
}
