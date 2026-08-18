"use server";

import sql from "@/shared/lib/db";
import ensurePrivilieges from "./ensurePrivilieges";

export async function updateUser(
  id: number,
  data: Partial<{
    active: boolean;
    is_eligible_for_salary: boolean;
    probation_bypass: boolean;
  }>,
) {
  await ensurePrivilieges(["Администратор"]);

  const payload: typeof data & { inactive_since?: string | null } = { ...data };
  if (data.active !== undefined) {
    payload.inactive_since = data.active ? null : new Date().toISOString();
  }

  let updatedUser;
  try {
    [updatedUser] = await sql<any[]>`
      UPDATE "user" SET ${sql(payload)} WHERE id = ${id} RETURNING *
    `;
  } catch (error) {
    console.error("Ошибка при обновлении пользователя:", error);
    throw new Error("Не удалось обновить пользователя");
  }

  if (!updatedUser) {
    console.error("Ошибка при обновлении пользователя: not found");
    throw new Error("Не удалось обновить пользователя");
  }

  return updatedUser;
}
