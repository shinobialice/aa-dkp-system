"use server";
import sql from "@/shared/lib/db";

export type RoleSlot = 1 | 2 | 3;

export type ArchetypeSlot = {
  specialization1: string | null;
  specialization2: string | null;
  specialization3: string | null;
  className: string | null;
};

// Класс (3 специализации + имя) хранится отдельно на каждую роль — у игрока
// с несколькими ролями (Роль 2/3) под каждой может быть свой билд.
export type UserArchetype = Record<RoleSlot, ArchetypeSlot>;

const EMPTY_SLOT: ArchetypeSlot = {
  specialization1: null,
  specialization2: null,
  specialization3: null,
  className: null,
};

const EMPTY_ARCHETYPE: UserArchetype = {
  1: EMPTY_SLOT,
  2: EMPTY_SLOT,
  3: EMPTY_SLOT,
};

const getUserArchetype = async (userId: number): Promise<UserArchetype> => {
  try {
    const rows = await sql<any[]>`
      SELECT role_slot, specialization_1, specialization_2, specialization_3, class_name
      FROM user_archetype
      WHERE user_id = ${userId}
    `;

    const result: UserArchetype = { ...EMPTY_ARCHETYPE };
    for (const row of rows) {
      const slot = row.role_slot as RoleSlot;
      if (slot !== 1 && slot !== 2 && slot !== 3) continue;
      result[slot] = {
        specialization1: row.specialization_1,
        specialization2: row.specialization_2,
        specialization3: row.specialization_3,
        className: row.class_name,
      };
    }
    return result;
  } catch (error) {
    console.error("Ошибка при получении класса персонажа:", error);
    throw new Error("Не удалось загрузить класс персонажа");
  }
};

export default getUserArchetype;
