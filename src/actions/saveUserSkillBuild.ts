"use server";
import sql from "@/shared/lib/db";
import ensureCanEditUserData from "./ensureCanEditUserData";
import getUserArchetype, { RoleSlot } from "./getUserArchetype";
import getUserSkillBuild, {
  RoleSkillBuild,
  UserSkillBuild,
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

  let totalActiveSelected = 0;
  const cleaned: RoleSkillBuild = {};

  for (const [specializationId, data] of Object.entries(build)) {
    if (!allowedSpecs.has(specializationId)) {
      throw new Error("Эта специализация не выбрана для данной роли");
    }

    const skills = getSkillsForSpecialization(specializationId);
    const bySkillId = new Map(skills.map((s) => [s.id, s]));

    const rawSelected = Array.from(new Set(data.selected ?? []));
    for (const skillId of rawSelected) {
      if (!bySkillId.has(skillId)) {
        throw new Error(`Неизвестный навык: ${skillId}`);
      }
    }
    // Пассивки не хранятся — если что-то пассивное всё же прислали, тихо
    // отбрасываем, а не роняем сохранение.
    const activeSelected = rawSelected.filter(
      (id) => bySkillId.get(id)!.kind === "active",
    );

    for (const skillId of activeSelected) {
      const skill = bySkillId.get(skillId)!;
      const threshold = skill.unlockThreshold ?? 0;
      if (activeSelected.length - 1 < threshold) {
        throw new Error(
          `«${skill.name}» требует ещё ${threshold} активных навыков в этой ветке`,
        );
      }
    }

    const eferund: Record<string, string> = {};
    for (const [skillId, variantId] of Object.entries(data.eferund ?? {})) {
      if (!activeSelected.includes(skillId)) continue;
      const skill = bySkillId.get(skillId);
      if (!skill?.eferund?.some((v) => v.id === variantId)) {
        throw new Error(`Неизвестный вариант эфе'рунда: ${variantId}`);
      }
      eferund[skillId] = variantId;
    }

    totalActiveSelected += activeSelected.length;
    cleaned[specializationId] = { selected: activeSelected, eferund };
  }

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
