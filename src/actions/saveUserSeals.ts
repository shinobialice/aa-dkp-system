"use server";
import sql from "@/shared/lib/db";
import ensurePrivilieges from "./ensurePrivilieges";
import getUserSeals, { UserSeal } from "./getUserSeals";
import {
  MAX_USER_SEALS,
  isValidSealGrade,
  isValidSealName,
} from "@/widgets/profile/seals/sealsData";

export type SealInput = { sealName: string; grade: number };

// Полностью заменяет набор печатей игрока (не более MAX_USER_SEALS штук).
// Доступно только администраторам — проверяется на сервере, а не только в UI.
const saveUserSeals = async (
  userId: number,
  seals: SealInput[],
): Promise<UserSeal[]> => {
  await ensurePrivilieges(["Администратор"]);

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
    if (!isValidSealGrade(seal.grade)) {
      throw new Error(`Некорректная редкость печати: ${seal.grade}`);
    }
  }

  try {
    await sql.begin(async (tx) => {
      await tx`DELETE FROM user_seals WHERE user_id = ${userId}`;
      for (const seal of seals) {
        await tx`
          INSERT INTO user_seals (user_id, seal_name, grade)
          VALUES (${userId}, ${seal.sealName}, ${seal.grade})
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
