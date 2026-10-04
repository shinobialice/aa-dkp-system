"use server";
import sql from "@/shared/lib/db";
import ensureCanEditUserData from "./ensureCanEditUserData";
import {
  isValidBuffSelection,
  PERSONAL_BUFFS,
  type SelectedBuffs,
} from "@/widgets/profile/equipment/characterBuffs";

const saveCharacterBuffs = async (
  userId: number,
  buffs: SelectedBuffs,
): Promise<void> => {
  await ensureCanEditUserData(userId, "equipmentEditEnabled");

  if (!isValidBuffSelection(buffs, PERSONAL_BUFFS)) {
    throw new Error("Некорректный набор баффов");
  }

  try {
    await sql`UPDATE "user" SET character_buffs = ${sql.json(buffs)} WHERE id = ${userId}`;
  } catch (error) {
    console.error("Ошибка при сохранении баффов:", error);
    throw new Error("Не удалось сохранить баффы");
  }
};

export default saveCharacterBuffs;
