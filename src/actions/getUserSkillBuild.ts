"use server";
import sql from "@/shared/lib/db";
import type { UserSkillBuildRow } from "@/shared/lib/dbTypes";
import { isRoleSlot, type RoleSlot } from "@/shared/config/roleSlots";

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
    const rows = await sql<Pick<UserSkillBuildRow, "role_slot" | "build">[]>`
      SELECT role_slot, build FROM user_skill_build WHERE user_id = ${userId}
    `;

    const result: UserSkillBuild = { 1: {}, 2: {}, 3: {} };
    for (const row of rows) {
      if (!isRoleSlot(row.role_slot)) continue;
      result[row.role_slot] = (row.build as RoleSkillBuild | null) ?? {};
    }
    return result;
  } catch (error) {
    console.error("Ошибка при получении билда навыков:", error);
    throw new Error("Не удалось загрузить билд навыков");
  }
};

export default getUserSkillBuild;
