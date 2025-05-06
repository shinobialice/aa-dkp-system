"use server";
import { prisma } from "@/lib/db";

export async function getUserTags(userId: number) {
  return await prisma.userTags.findMany({
    where: { user_id: userId },
    orderBy: { created_at: "desc" },
  });
}

export async function addUserTag(userId: number, tag: string) {
  return await prisma.userTags.create({
    data: {
      user_id: userId,
      tag,
    },
  });
}

export async function deleteUserTag(tagId: number) {
  return await prisma.userTags.delete({
    where: {
      id: tagId,
    },
  });
}
