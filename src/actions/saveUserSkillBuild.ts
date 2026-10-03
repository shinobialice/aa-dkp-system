"use server";
import sql from "@/shared/lib/db";
import ensureCanEditUserData from "./ensureCanEditUserData";
import getUserArchetype, { type RoleSlot } from "./getUserArchetype";
import getUserSkillBuild, {
  type RoleSkillBuild,
  type SpecializationBuild,
  type UserSkillBuild,
} from "./getUserSkillBuild";
import {
  SKILL_POINTS_BUDGET,
  getSkillsForSpecialization,
} from "@/widgets/profile/archetype/skills";

// Заменяет билд навыков для одной роли целиком (все ветки сразу — как и
// сам список специализаций в saveUserArchetype.ts). Бюджет очков (21) и
// пороги открытия навыков (unlockThreshold) проверяются на сервере, а не
// только в UI — самоправщик не должен суметь обойти их прямым запросом.
//
// 21 очко тратится только на АКТИВНЫЕ навыки (суммарно по всем 3 веткам).
// Пассивки бесплатны и не выбираются вручную — они автоматически считаются
// взятыми, когда в ветке набрано нужное число активных (unlockThreshold в
// skills/isceleine.ts), поэтому selected хранит только id активных навыков.
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

  const cleaned: RoleSkillBuild = {};
  for (const [specializationId, data] of Object.entries(build)) {
    if (!allowedSpecs.has(specializationId)) {
      throw new Error("Эта специализация не выбрана для данной роли");
    }
    cleaned[specializationId] = cleanSpecializationBuild(
      specializationId,
      data,
    );
  }

  const totalActiveSelected = Object.values(cleaned).reduce(
    (sum, spec) => sum + spec.selected.length,
    0,
  );
  if (totalActiveSelected > SKILL_POINTS_BUDGET) {
    throw new Error(
      `Максимум ${SKILL_POINTS_BUDGET} очков активных навыков на роль`,
    );
  }

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

// Пассивки не хранятся: если их всё же прислали, они тихо отбрасываются.
function cleanSpecializationBuild(
  specializationId: string,
  data: SpecializationBuild,
): SpecializationBuild {
  const bySkillId = new Map(
    getSkillsForSpecialization(specializationId).map((skill) => [
      skill.id,
      skill,
    ]),
  );

  const selectedSkills = Array.from(new Set(data.selected ?? []), (skillId) => {
    const skill = bySkillId.get(skillId);
    if (!skill) throw new Error(`Неизвестный навык: ${skillId}`);
    return skill;
  });
  const activeSkills = selectedSkills.filter(
    (skill) => skill.kind === "active",
  );

  for (const skill of activeSkills) {
    const threshold = skill.unlockThreshold ?? 0;
    if (activeSkills.length - 1 < threshold) {
      throw new Error(
        `«${skill.name}» требует ещё ${threshold} активных навыков в этой ветке`,
      );
    }
  }

  const activeIds = activeSkills.map((skill) => skill.id);
  const eferund: Record<string, string> = {};
  for (const [skillId, variantId] of Object.entries(data.eferund ?? {})) {
    if (!activeIds.includes(skillId)) continue;
    const skill = bySkillId.get(skillId);
    if (!skill?.eferund?.some((variant) => variant.id === variantId)) {
      throw new Error(`Неизвестный вариант эфе'рунда: ${variantId}`);
    }
    eferund[skillId] = variantId;
  }

  return { selected: activeIds, eferund };
}
