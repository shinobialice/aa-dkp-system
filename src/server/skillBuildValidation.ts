import "server-only";
import type {
  RoleSkillBuild,
  SpecializationBuild,
} from "@/actions/getUserSkillBuild";
import {
  SKILL_POINTS_BUDGET,
  getSkillsForSpecialization,
} from "@/widgets/profile/archetype/skills";

// 21 очко тратится только на АКТИВНЫЕ навыки (суммарно по всем 3 веткам).
// Пассивки бесплатны и не выбираются вручную — они автоматически считаются
// взятыми, когда в ветке набрано нужное число активных (unlockThreshold в
// skills/isceleine.ts), поэтому selected хранит только id активных навыков.
export function cleanSkillBuild(build: RoleSkillBuild): RoleSkillBuild {
  const cleaned: RoleSkillBuild = {};
  for (const [specializationId, data] of Object.entries(build)) {
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
  return cleaned;
}

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
