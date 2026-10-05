"use server";

import sql from "@/shared/lib/db";
import { publishChanges } from "@/server/liveChanges";
import type { UserRow } from "@/shared/lib/dbTypes";

import { revalidatePath } from "next/cache";
import ensurePrivilieges from "./ensurePrivilieges";

export type CreatedUser = Pick<UserRow, "id" | "username">;

export async function createUser(username: string) {
  await ensurePrivilieges(["Администратор"]);

  let data: CreatedUser | undefined;
  try {
    [data] = await sql<CreatedUser[]>`
      INSERT INTO "user" (username, active, created_at, joined_at, is_eligible_for_salary)
      VALUES (${username}, true, now(), now(), false)
      RETURNING id, username
    `;
  } catch (error) {
    console.error("Ошибка создания пользователя:", error);
    throw new Error("Не удалось создать пользователя");
  }

  if (!data) throw new Error("Не удалось создать пользователя");
  await publishChanges("members");

  revalidatePath("/settings");
  return data;
}
