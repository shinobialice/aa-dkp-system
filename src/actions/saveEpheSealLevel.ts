"use server";
import sql from "@/shared/lib/db";
import ensureCanEditUserData from "./ensureCanEditUserData";
import getUserEquipment, { UserEquipment } from "./getUserEquipment";
import { isValidEquipmentSlot } from "@/widgets/profile/equipment/equipmentData";
import { isValidEpheSealLevel } from "@/widgets/profile/ephe/epheSealsData";

const saveEpheSealLevel = async (
  userId: number,
  slot: string,
  level: number,
): Promise<UserEquipment[]> => {
  await ensureCanEditUserData(userId, "equipmentEditEnabled");

  if (!isValidEquipmentSlot(slot)) {
    throw new Error(`Неизвестный слот экипировки: ${slot}`);
  }
  if (!isValidEpheSealLevel(slot, level)) {
    throw new Error(`Некорректный уровень печати Эфе: ${level}`);
  }

  try {
    const result = await sql`
      UPDATE user_equipment SET ephe_seal_level = ${level}
      WHERE user_id = ${userId} AND slot = ${slot}
    `;
    if (result.count === 0) {
      throw new Error("В этом слоте нет предмета");
    }
  } catch (error) {
    console.error("Ошибка при сохранении печати Эфе:", error);
    throw error instanceof Error &&
      error.message === "В этом слоте нет предмета"
      ? error
      : new Error("Не удалось сохранить печать Эфе");
  }

  return getUserEquipment(userId);
};

export default saveEpheSealLevel;
