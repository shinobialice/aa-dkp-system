"use server";

import { prisma } from "@/lib/db";

export const getAllUsers = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      class: true,
      active: true,
    },
  });

  return users;
};
