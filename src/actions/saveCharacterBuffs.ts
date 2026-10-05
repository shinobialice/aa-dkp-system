"use server";
import sql from "@/shared/lib/db";
import { isRoleSlot, type RoleSlot } from "@/shared/config/roleSlots";
import ensureCanEditUserData from "./ensureCanEditUserData";
import {
  isValidBuffSelection,
  PERSONAL_BUFFS,
  type SelectedBuffs,
} from "@/widgets/profile/equipment/characterBuffs";

const saveCharacterBuffs = async (
  userId: number,
  roleSlot: RoleSlot,
  buffs: SelectedBuffs,
): Promise<void> => {
  await ensureCanEditUserData(userId, "equipmentEditEnabled");

  if (!isRoleSlot(roleSlot)) {
    throw new Error("Некорректная роль");
  }
  if (!isValidBuffSelection(buffs, PERSONAL_BUFFS)) {
    throw new Error("Некорректный набор баффов");
  }

  try {
    await sql`
      INSERT INTO user_character_buffs (user_id, role_slot, buffs, updated_at)
      VALUES (${userId}, ${roleSlot}, ${sql.json(buffs)}, now())
      ON CONFLICT (user_id, role_slot) DO UPDATE SET
        buffs = EXCLUDED.buffs,
        updated_at = EXCLUDED.updated_at
    `;
  } catch (error) {
    console.error("Ошибка при сохранении баффов:", error);
    throw new Error("Не удалось сохранить баффы");
  }
};

export default saveCharacterBuffs;
