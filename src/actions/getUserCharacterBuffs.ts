"use server";
import sql from "@/shared/lib/db";
import type { UserCharacterBuffsRow } from "@/shared/lib/dbTypes";
import { isRoleSlot, type RoleSlot } from "@/shared/config/roleSlots";
import {
  parseSelectedBuffs,
  PERSONAL_BUFFS,
  pickBuffs,
  type SelectedBuffs,
} from "@/widgets/profile/equipment/characterBuffs";

export type UserCharacterBuffs = Record<RoleSlot, SelectedBuffs>;

const getUserCharacterBuffs = async (
  userId: number,
): Promise<UserCharacterBuffs> => {
  try {
    const rows = await sql<
      Pick<UserCharacterBuffsRow, "role_slot" | "buffs">[]
    >`
      SELECT role_slot, buffs FROM user_character_buffs WHERE user_id = ${userId}
    `;

    const result: UserCharacterBuffs = { 1: {}, 2: {}, 3: {} };
    for (const row of rows) {
      if (!isRoleSlot(row.role_slot)) continue;
      result[row.role_slot] = pickBuffs(
        parseSelectedBuffs(row.buffs),
        PERSONAL_BUFFS,
      );
    }
    return result;
  } catch (error) {
    console.error("Ошибка при получении баффов:", error);
    throw new Error("Не удалось загрузить баффы");
  }
};

export default getUserCharacterBuffs;
