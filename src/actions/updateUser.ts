"use server";

import prisma from "@/lib/db";

export async function updateUser(
  id: number,
  data: Partial<{ active: boolean; is_eligible_for_salary: boolean }>
) {
  return prisma.user.update({
    where: { id },
    data,
  });
}
