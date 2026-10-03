"use server";

import { randomUUID } from "crypto";
import sql from "@/shared/lib/db";
import { getBaseUrl } from "@/shared/lib";
import ensurePrivilieges from "./ensurePrivilieges";

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

export async function createLinkToken(userId: number) {
  await ensurePrivilieges(["Администратор"]);
  const token = randomUUID();
  const expiresAt = new Date(Date.now() + TOKEN_TTL_MS).toISOString();

  let data: { id: number } | undefined;
  try {
    [data] = await sql<{ id: number }[]>`
      INSERT INTO link_token (token, "userId", "expiresAt", used)
      VALUES (${token}, ${userId}, ${expiresAt}, false)
      RETURNING id
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
