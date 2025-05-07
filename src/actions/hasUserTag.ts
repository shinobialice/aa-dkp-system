import { getServerSession } from "next-auth";
import authOptions from "@/auth";
import prisma from "@/lib/db";

export async function hasUserTag(tag: string): Promise<boolean> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return false;

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { tags: true },
  });

  if (!user) return false;
  return user.tags.some((t) => t.tag === tag);
}
