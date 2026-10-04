"use server";
import sql from "@/shared/lib/db";

export type UserEquipment = {
  id: number;
  user_id: number;
  slot: string;
  item_name: string | null;
  grade: number;
  enchant: number;
  extra_protection: number;
  engravings: number[];
  rune_id: number;
  synthesis_effects: number[];
  synthesis_percent: number;
  ephe_seal_level: number;
};

const getUserEquipment = async (userId: number): Promise<UserEquipment[]> => {
  try {
    return await sql<UserEquipment[]>`
      SELECT id, user_id, slot, item_name, grade, enchant, extra_protection, engravings, rune_id, synthesis_effects, synthesis_percent, ephe_seal_level
      FROM user_equipment
      WHERE user_id = ${userId}
    `;
  } catch (error) {
    console.error("Ошибка при получении экипировки:", error);
    throw new Error("Не удалось загрузить экипировку");
  }
};

export default getUserEquipment;
