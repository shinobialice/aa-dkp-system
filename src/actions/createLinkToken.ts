"use server";

import { randomUUID } from "crypto";
import sql from "@/shared/lib/db";
import { getBaseUrl } from "@/shared/lib";

export async function createLinkToken(userId: number) {
  const token = randomUUID();
  const expiresAt = new Date(Date.now() + 86400_000).toISOString();

  let data;
  try {
    [data] = await sql<any[]>`
      INSERT INTO link_token (token, "userId", "expiresAt", used)
      VALUES (${token}, ${userId}, ${expiresAt}, false)
      RETURNING *
    `;
  } catch (error) {
    console.error("Error creating link token:", error);
    throw new Error("Не удалось создать токен привязки");
  }

  if (!data) {
    console.error("Error creating link token: no data");
    throw new Error("Не удалось создать токен привязки");
  }

  return `${getBaseUrl()}/link-account/${token}`;
}
