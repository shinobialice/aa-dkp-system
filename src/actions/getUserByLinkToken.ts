"use server";

import { prisma } from "@/lib/db";

export async function getUserByLinkToken(token: string) {
  console.log("[getUserByLinkToken] token:", token);

  const result = await prisma.linkToken.findUnique({
    where: { token },
    include: { user: true },
  });

  console.log("[getUserByLinkToken] result:", result);

  if (!result) {
    console.warn("[getUserByLinkToken] token not found");
    return null;
  }

  if (result.used) {
    console.warn("[getUserByLinkToken] token already used");
    return null;
  }

  if (result.expiresAt < new Date()) {
    console.warn("[getUserByLinkToken] token expired:", result.expiresAt);
    return null;
  }

  return {
    username: result.user.username,
    expiresAt: result.expiresAt.toISOString(),
  };
}
