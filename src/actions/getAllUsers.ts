"use server";

import prisma from "@/lib/db";

export const getAllUsersWithInventory = async () => {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      username: true,
      class: true,
      active: true,
      inventory: {
        select: {
          name: true,
          type: true,
          created_at: true,
        },
      },
    },
  });

  return users;
};
