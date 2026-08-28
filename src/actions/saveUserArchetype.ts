"use server";
import sql from "@/shared/lib/db";
import ensureCanEditUserData from "./ensureCanEditUserData";
import getUserArchetype, { RoleSlot, UserArchetype } from "./getUserArchetype";
import { isValidSpecializationId } from "@/widgets/profile/archetype/specializationsData";
import { lookupClassName } from "@/widgets/profile/archetype/classCombinations";

export type ArchetypeInput = {
  specialization1: string | null;
  specialization2: string | null;
  specialization3: string | null;
};

// Заменяет выбор специализаций для одной роли игрока (1 — основная, 2/3 —
// доп. роли). Имя класса не принимается с клиента — оно всегда считается на
// сервере по таблице сочетаний (см. classCombinations.ts), чтобы его нельзя
// было вписать произвольным текстом.
// Администраторам/Секретуткам — всегда, самому игроку — только если включен
// тумблер "Класс" в Настройках (проверяется на сервере, а не только в UI).
const saveUserArchetype = async (
  userId: number,
  roleSlot: RoleSlot,
  input: ArchetypeInput,
): Promise<UserArchetype> => {
  await ensureCanEditUserData(userId, "archetypeEditEnabled");

  const specs = [
    input.specialization1,
    input.specialization2,
    input.specialization3,
  ];

  for (const spec of specs) {
    if (spec && !isValidSpecializationId(spec)) {
      throw new Error(`Неизвестная специализация: ${spec}`);
    }
  }

  const chosen = specs.filter((s): s is string => !!s);
  if (new Set(chosen).size !== chosen.length) {
    throw new Error("Специализации не должны повторяться");
  }

  const className = lookupClassName(specs);

  try {
    await sql`
      INSERT INTO user_archetype
        (user_id, role_slot, specialization_1, specialization_2, specialization_3, class_name, updated_at)
      VALUES
        (${userId}, ${roleSlot}, ${input.specialization1}, ${input.specialization2}, ${input.specialization3}, ${className}, now())
      ON CONFLICT (user_id, role_slot) DO UPDATE SET
        specialization_1 = EXCLUDED.specialization_1,
        specialization_2 = EXCLUDED.specialization_2,
        specialization_3 = EXCLUDED.specialization_3,
        class_name = EXCLUDED.class_name,
        updated_at = EXCLUDED.updated_at
    `;
  } catch (error) {
    console.error("Ошибка при сохранении класса персонажа:", error);
    throw new Error("Не удалось сохранить класс персонажа");
  }

  return getUserArchetype(userId);
};

export default saveUserArchetype;
