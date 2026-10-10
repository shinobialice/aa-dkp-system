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
      SELECT e.id, e.user_id, e.role_slot, e.slot, e.item_name, e.grade, e.enchant, e.engravings, e.rune_id, e.synthesis_effects, e.synthesis_percent,
        coalesce(s.level, 0) AS ephe_seal_level
      FROM user_equipment e
      LEFT JOIN user_ephe_seals s ON s.user_id = e.user_id AND s.slot = e.slot
      WHERE e.user_id = ${userId}
    `;
  } catch (error) {
    console.error("Ошибка при получении экипировки:", error);
    throw new Error("Не удалось загрузить экипировку");
  }
};

export default getUserEquipment;
