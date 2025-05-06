// actions/hasUserTag.ts
import { prisma } from "@/lib/db";

export async function hasTag(userId: number, target: string) {
  const tag = await prisma.userTags.findFirst({
    where: {
      user_id: userId,
      tag: target,
    },
  });
  return !!tag;
}
