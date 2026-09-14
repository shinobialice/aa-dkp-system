"use server";
import sql from "@/shared/lib/db";
import ensureCanEditUserData from "./ensureCanEditUserData";
import getUserSeals, { UserSeal } from "./getUserSeals";
import {
  MAX_USER_SEALS,
  isValidSealLevel,
  isValidSealName,
} from "@/widgets/profile/seals/sealsData";

export type SealInput = { sealName: string; level: number };

// Полностью заменяет набор печатей игрока (не более MAX_USER_SEALS штук).
// Администраторам/Секретуткам — всегда, самому игроку — только если включен
// тумблер "Печати" в Настройках (проверяется на сервере, а не только в UI).
const saveUserSeals = async (
  userId: number,
  seals: SealInput[],
): Promise<UserSeal[]> => {
  await ensureCanEditUserData(userId, "sealsEditEnabled");

  if (seals.length > MAX_USER_SEALS) {
    throw new Error(`Нельзя выбрать больше ${MAX_USER_SEALS} печатей`);
  }

  const uniqueNames = new Set(seals.map((s) => s.sealName));
  if (uniqueNames.size !== seals.length) {
    throw new Error("Печати не должны повторяться");
  }

  for (const seal of seals) {
    if (!isValidSealName(seal.sealName)) {
      throw new Error(`Неизвестная печать: ${seal.sealName}`);
    }
    if (!isValidSealLevel(seal.level)) {
      throw new Error(`Некорректный уровень печати: ${seal.level}`);
    }
  }

  try {
    await sql.begin(async (tx) => {
      await tx`DELETE FROM user_seals WHERE user_id = ${userId}`;
      for (const seal of seals) {
        await tx`
          INSERT INTO user_seals (user_id, seal_name, level)
          VALUES (${userId}, ${seal.sealName}, ${seal.level})
        `;
      }
    });
  } catch (error) {
    console.error("Ошибка при сохранении печатей:", error);
    throw new Error("Не удалось сохранить печати");
  }

  return getUserSeals(userId);
};

export default saveUserSeals;
