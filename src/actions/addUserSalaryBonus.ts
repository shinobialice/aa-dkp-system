"use server";

import prisma from "@/lib/db";

export async function addUserSalaryBonus({
  userId,
  amount,
  reason,
}: {
  userId: number;
  amount: number;
  reason: string;
}) {
  if (amount <= 0) {throw new Error("Бонус должен быть больше 0%");}
  if (!reason.trim()) {throw new Error("Нужен комментарий за что бонус");}

  await prisma.userSalaryBonus.create({
    data: {
      user_id: userId,
      amount,
      reason,
    },
  });
}

export async function deleteUserSalaryBonus(id: number) {
  await prisma.userSalaryBonus.delete({
    where: { id },
  });
}
