"use server";
import sql from "@/shared/lib/db";
import { isRoleSlot, type RoleSlot } from "@/shared/config/roleSlots";
import ensureCanEditUserData from "./ensureCanEditUserData";
import getUserEquipment, { type UserEquipment } from "./getUserEquipment";

const copyRoleEquipment = async (
  userId: number,
  fromRole: RoleSlot,
  toRole: RoleSlot,
): Promise<UserEquipment[]> => {
  await ensureCanEditUserData(userId, "equipmentEditEnabled");

  if (!isRoleSlot(fromRole) || !isRoleSlot(toRole) || fromRole === toRole) {
    throw new Error("Некорректные роли для копирования");
  }

  try {
    await sql.begin(async (tx) => {
      await tx`DELETE FROM user_equipment WHERE user_id = ${userId} AND role_slot = ${toRole}`;
      await tx`
        INSERT INTO user_equipment (user_id, role_slot, slot, item_name, grade, enchant, engravings, rune_id, synthesis_effects, synthesis_percent)
        SELECT user_id, ${toRole}, slot, item_name, grade, enchant, engravings, rune_id, synthesis_effects, synthesis_percent
        FROM user_equipment
        WHERE user_id = ${userId} AND role_slot = ${fromRole}
      `;
    });
  } catch (error) {
    console.error("Ошибка при копировании экипировки:", error);
    throw new Error("Не удалось скопировать экипировку");
  }

  return getUserEquipment(userId);
};

export default copyRoleEquipment;
