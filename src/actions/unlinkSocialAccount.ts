"use server";
import { cookies } from "next/headers";
import sql from "@/shared/lib/db";
import { hasTag } from "./hasTag";
import type { SocialProvider } from "@/shared/lib/socialProviders";

export async function unlinkSocialAccount(
  userId: number,
  provider: SocialProvider,
  endSession: boolean,
) {
  const sessionToken = (await cookies()).get("session_token")?.value ?? "";
  const isAdmin = await hasTag(sessionToken, ["Администратор"]);
  if (!isAdmin) {
    throw new Error("Доступ запрещён: нужны права администратора");
  }

  const [existing] = await sql<any[]>`
    SELECT id FROM "user" WHERE id = ${userId}
  `;
  if (!existing) {
    throw new Error("Игрок не найден");
  }

  if (provider === "vk") {
    await sql`UPDATE "user" SET vk_id = NULL, vk_name = NULL WHERE id = ${userId}`;
  } else if (provider === "google") {
    await sql`UPDATE "user" SET google_id = NULL WHERE id = ${userId}`;
  } else {
    await sql`UPDATE "user" SET mail_id = NULL WHERE id = ${userId}`;
  }

  if (endSession) {
    await sql`UPDATE "user" SET session_token = NULL WHERE id = ${userId}`;
  }
}
