"use server";
import sql from "@/shared/lib/db";
import { cleanSkillBuild } from "@/server/skillBuildValidation";
import ensureCanEditUserData from "./ensureCanEditUserData";
import getUserArchetype, { type RoleSlot } from "./getUserArchetype";
import getUserSkillBuild, {
  type RoleSkillBuild,
  type UserSkillBuild,
} from "./getUserSkillBuild";

// Заменяет билд навыков для одной роли целиком (все ветки сразу — как и
// сам список специализаций в saveUserArchetype.ts). Бюджет очков (21) и
// пороги открытия навыков (unlockThreshold) проверяются на сервере, а не
// только в UI — самоправщик не должен суметь обойти их прямым запросом.
const saveUserSkillBuild = async (
  userId: number,
  roleSlot: RoleSlot,
  build: RoleSkillBuild,
): Promise<UserSkillBuild> => {
  await ensureCanEditUserData(userId, "archetypeEditEnabled");

  const archetype = await getUserArchetype(userId);
  const slot = archetype[roleSlot];
  const allowedSpecs = new Set(
    [slot.specialization1, slot.specialization2, slot.specialization3].filter(
      (s): s is string => !!s,
    ),
  );

  for (const specializationId of Object.keys(build)) {
    if (!allowedSpecs.has(specializationId)) {
      throw new Error("Эта специализация не выбрана для данной роли");
    }
  }
  const cleaned = cleanSkillBuild(build);

  try {
    await sql`
      INSERT INTO user_skill_build (user_id, role_slot, build, updated_at)
      VALUES (${userId}, ${roleSlot}, ${sql.json(cleaned)}, now())
      ON CONFLICT (user_id, role_slot) DO UPDATE SET
        build = EXCLUDED.build,
        updated_at = EXCLUDED.updated_at
    `;
  } catch (error) {
    console.error("Ошибка при сохранении билда навыков:", error);
    throw new Error("Не удалось сохранить билд навыков");
  }

  return getUserSkillBuild(userId);
};

export default saveUserSkillBuild;
