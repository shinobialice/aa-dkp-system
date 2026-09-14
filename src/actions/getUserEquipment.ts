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
  costume_synthesis_effects: number[];
  underwear_synthesis_effects: number[];
  cursed_synthesis_effects: number[];
  ephen_synthesis_percent: number;
  ephen_synthesis_primary: string;
  ephen_synthesis_secondary: string;
  ephen_synthesis_tertiary: string[];
};

const getUserEquipment = async (userId: number): Promise<UserEquipment[]> => {
  try {
    return await sql<UserEquipment[]>`
      SELECT id, user_id, slot, item_name, grade, enchant, extra_protection, engravings, rune_id, costume_synthesis_effects, underwear_synthesis_effects, cursed_synthesis_effects, ephen_synthesis_percent, ephen_synthesis_primary, ephen_synthesis_secondary, ephen_synthesis_tertiary
      FROM user_equipment
      WHERE user_id = ${userId}
    `;
  } catch (error) {
    console.error("Ошибка при получении экипировки:", error);
    throw new Error("Не удалось загрузить экипировку");
  }
};

export default getUserEquipment;
