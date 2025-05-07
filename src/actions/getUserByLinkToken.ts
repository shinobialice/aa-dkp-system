"use server";

import prisma from "@/lib/db";

export async function getUserByLinkToken(token: string) {
  const result = await prisma.linkToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!result) {
    return null;
  }

  if (result.used) {
    return null;
  }

  if (result.expiresAt < new Date()) {
    return null;
  }

  return {
    username: result.user.username,
    expiresAt: result.expiresAt.toISOString(),
  };
}
