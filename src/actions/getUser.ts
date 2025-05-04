"use server";

import { prisma } from "@/lib/db";

const getUser = async (userId: number) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(userId) },
    select: {
      id: true,
      username: true,
      class: true,
      class_gear_score: true,
      secondary_class: true,
      secondary_class_gear_score: true,
      vk_name: true,
      active: true,
      is_eligible_for_salary: true,
      joined_at: true,
    },
  });
  return user;
};

export default getUser;
