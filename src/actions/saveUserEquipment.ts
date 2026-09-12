"use server";
import sql from "@/shared/lib/db";
import ensureCanEditUserData from "./ensureCanEditUserData";
import getUserEquipment, { UserEquipment } from "./getUserEquipment";
import { isValidEquipmentSlot } from "@/widgets/profile/equipment/equipmentData";
import { isValidSealGrade } from "@/widgets/profile/seals/sealsData";
import { isValidEnchantLevel } from "@/widgets/profile/equipment/itemsData/statsFormula";

export type EquipmentInput = {
  slot: string;
  itemName: string | null;
  grade: number;
  enchant: number;
};

// Полностью заменяет экипировку игрока. Пустые слоты (без названия
// предмета) в базе не хранятся.
const saveUserEquipment = async (
  userId: number,
  items: EquipmentInput[],
): Promise<UserEquipment[]> => {
  await ensureCanEditUserData(userId, "equipmentEditEnabled");

  const uniqueSlots = new Set(items.map((i) => i.slot));
  if (uniqueSlots.size !== items.length) {
    throw new Error("Слоты экипировки не должны повторяться");
  }

  for (const item of items) {
    if (!isValidEquipmentSlot(item.slot)) {
      throw new Error(`Неизвестный слот экипировки: ${item.slot}`);
    }
    if (!isValidSealGrade(item.grade)) {
      throw new Error(`Некорректный грейд: ${item.grade}`);
    }
    if (!isValidEnchantLevel(item.enchant)) {
      throw new Error(`Некорректный уровень заточки: ${item.enchant}`);
    }
  }

  const filled = items.filter((i) => (i.itemName ?? "").trim() !== "");

  try {
    await sql.begin(async (tx) => {
      await tx`DELETE FROM user_equipment WHERE user_id = ${userId}`;
      for (const item of filled) {
        await tx`
          INSERT INTO user_equipment (user_id, slot, item_name, grade, enchant)
          VALUES (${userId}, ${item.slot}, ${item.itemName!.trim()}, ${item.grade}, ${item.enchant})
        `;
      }
    });
  } catch (error) {
    console.error("Ошибка при сохранении экипировки:", error);
    throw new Error("Не удалось сохранить экипировку");
  }

  return getUserEquipment(userId);
};

export default saveUserEquipment;
