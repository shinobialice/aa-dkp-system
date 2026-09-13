"use server";
import sql from "@/shared/lib/db";
import ensureCanEditUserData from "./ensureCanEditUserData";
import { isValidCharacterLevel } from "@/widgets/profile/equipment/characterLevel";

const saveCharacterLevel = async (
  userId: number,
  level: number,
): Promise<void> => {
  await ensureCanEditUserData(userId, "equipmentEditEnabled");

  if (!isValidCharacterLevel(level)) {
    throw new Error(`Некорректный уровень персонажа: ${level}`);
  }

  try {
    await sql`UPDATE "user" SET character_level = ${level} WHERE id = ${userId}`;
  } catch (error) {
    console.error("Ошибка при сохранении уровня персонажа:", error);
    throw new Error("Не удалось сохранить уровень персонажа");
  }
};

export default saveCharacterLevel;
