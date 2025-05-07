"use server";

import { randomUUID } from "crypto";
import prisma from "@/lib/db";

export async function createLinkToken(userId: number) {
  const token = randomUUID();

  await prisma.linkToken.create({
    data: {
      token,
      userId,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
    },
  });

  return `${process.env.NEXT_PUBLIC_BASE_URL}/link-account/${token}`;
}
