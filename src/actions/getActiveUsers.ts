"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const getActiveUsers = async () => {
  const users = await prisma.user.findMany({
    where: { active: true },
    select: {
      id: true,
      username: true,
      class: true,
      active: true,
    },
  });

  return users;
};
