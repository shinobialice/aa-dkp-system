"use server";
import sql from "@/shared/lib/db";
import type { RoleSlot } from "./getUserArchetype";

// Билд одной ветки специализации: какие конкретно навыки взяты и в какой
// форме (эфе'рунд) — необязательная детализация поверх выбора в
// ClassArchetypeTab. selected/eferund ключуются по Skill.id из
// widgets/profile/archetype/skills.
export type SpecializationBuild = {
  selected: string[];
  eferund: Record<string, string>;
};

// Ключ — id специализации (specialization1/2/3 из user_archetype для этой роли).
export type RoleSkillBuild = Record<string, SpecializationBuild>;

export type UserSkillBuild = Record<RoleSlot, RoleSkillBuild>;

const getUserSkillBuild = async (userId: number): Promise<UserSkillBuild> => {
  try {
    const rows = await sql<any[]>`
      SELECT role_slot, build FROM user_skill_build WHERE user_id = ${userId}
    `;

    const result: UserSkillBuild = { 1: {}, 2: {}, 3: {} };
    for (const row of rows) {
      const slot = row.role_slot as RoleSlot;
      if (slot !== 1 && slot !== 2 && slot !== 3) continue;
      result[slot] = row.build ?? {};
    }
    return result;
  } catch (error) {
    console.error("Ошибка при получении билда навыков:", error);
    throw new Error("Не удалось загрузить билд навыков");
  }
};

export default getUserSkillBuild;
