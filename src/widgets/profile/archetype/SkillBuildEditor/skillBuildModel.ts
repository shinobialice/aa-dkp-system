import { getSkillsForSpecialization, type Skill } from "../skills";
import type {
  RoleSkillBuild,
  SpecializationBuild,
} from "@/actions/getUserSkillBuild";

export const EMPTY_SPEC_BUILD: SpecializationBuild = {
  selected: [],
  eferund: {},
};

export type DisplaySkill = {
  name: string;
  iconUrl: string;
  meta: string[];
  description: string;
};

// Бюджет (21) и пороги открытия считаются только по АКТИВНЫМ навыкам —
// пассивки бесплатны, лишь гейтятся числом взятых активных той же ветки.
export function activeCountOf(skills: Skill[], selected: string[]): number {
  const activeIds = new Set(
    skills.filter((s) => s.kind === "active").map((s) => s.id),
  );
  return selected.filter((id) => activeIds.has(id)).length;
}

export function totalActiveSelected(build: RoleSkillBuild): number {
  return Object.entries(build).reduce((sum, [specId, spec]) => {
    const skills = getSkillsForSpecialization(specId);
    return sum + activeCountOf(skills, spec?.selected ?? []);
  }, 0);
}

// Если сняли активный навык, у которого были "дети" по порогу открытия
// (unlockThreshold) — снимаем и их, рекурсивно, как в игре. Порог всегда
// считается по числу взятых активных, поэтому снятие пассивки ни на что
// каскадом не влияет.
export function removeWithCascade(
  skills: Skill[],
  selected: string[],
  skillId: string,
): string[] {
  let next = selected.filter((id) => id !== skillId);
  let changed = true;
  while (changed) {
    changed = false;
    const activeCount = activeCountOf(skills, next);
    for (const id of [...next]) {
      const skill = skills.find((s) => s.id === id);
      const threshold = skill?.unlockThreshold ?? 0;
      if (threshold > 0 && activeCount < threshold) {
        next = next.filter((x) => x !== id);
        changed = true;
      }
    }
  }
  return next;
}
