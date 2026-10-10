"use server";
import sql from "@/shared/lib/db";
import type { UserEpheSealsRow } from "@/shared/lib/dbTypes";

export type UserEpheSeals = Record<string, number>;

const getUserEpheSeals = async (userId: number): Promise<UserEpheSeals> => {
  try {
    const rows = await sql<Pick<UserEpheSealsRow, "slot" | "level">[]>`
      SELECT slot, level FROM user_ephe_seals WHERE user_id = ${userId}
    `;
    return Object.fromEntries(rows.map((row) => [row.slot, row.level]));
  } catch (error) {
    console.error("Ошибка при получении печатей Эфе:", error);
    throw new Error("Не удалось загрузить печати Эфе");
  }
};

export default getUserEpheSeals;
