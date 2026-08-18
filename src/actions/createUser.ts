"use server";

import sql from "@/shared/lib/db";
import { revalidatePath } from "next/cache";
import ensurePrivilieges from "./ensurePrivilieges";

export async function createUser(username: string) {
  await ensurePrivilieges(["Администратор"]);

  let data;
  try {
    [data] = await sql<any[]>`
      INSERT INTO "user" (username, active, created_at, is_eligible_for_salary)
      VALUES (${username}, true, now(), false)
      RETURNING *
    `;
  } catch (error) {
    console.error("Ошибка создания пользователя:", error);
    throw new Error("Не удалось создать пользователя");
  }

  revalidatePath("/settings");
  return data;
}
