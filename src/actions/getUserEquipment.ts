"use server";
import sql from "@/shared/lib/db";
import type { RoleSlot } from "@/shared/config/roleSlots";

export type UserEquipment = {
  id: number;
  user_id: number;
  role_slot: RoleSlot;
  slot: string;
  item_name: string | null;
  grade: number;
  enchant: number;
  engravings: number[];
  rune_id: number;
  synthesis_effects: number[];
  synthesis_percent: number;
  ephe_seal_level: number;
};

const getUserEquipment = async (userId: number): Promise<UserEquipment[]> => {
  try {
    return await sql<UserEquipment[]>`
      SELECT id, user_id, role_slot, slot, item_name, grade, enchant, engravings, rune_id, synthesis_effects, synthesis_percent, ephe_seal_level
      FROM user_equipment
      WHERE user_id = ${userId}
    `;
  } catch (error) {
    console.error("Ошибка при получении экипировки:", error);
    throw new Error("Не удалось загрузить экипировку");
  }
};

export default getUserEquipment;
