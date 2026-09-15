import type { Skill } from "./types";
import { ISCELEINE_SKILLS } from "./isceleine";
import { NAPADENIE_SKILLS } from "./napadenie";
import { MISTICIZM_SKILLS } from "./misticizm";
import { GNEV_SKILLS } from "./gnev";
import { PRESLEDOVANIE_SKILLS } from "./presledovanie";
import { SKRITNOST_SKILLS } from "./skritnost";
import { KOVARSTVO_SKILLS } from "./kovarstvo";
import { VOLSHEBSTVO_SKILLS } from "./volshebstvo";
import { OBORONA_SKILLS } from "./oborona";
import { TANEC_SKILLS } from "./tanec";
import { SOPROTIVLENIE_SKILLS } from "./soprotivlenie";
import { GIPNOZ_SKILLS } from "./gipnoz";
import { VOODUSH_SKILLS } from "./voodush";
import { STRELBA_SKILLS } from "./strelba";

export * from "./types";

// Суммарный бюджет очков навыков на роль — делится между всеми тремя
// выбранными ветками специализаций (не по 21 на каждую).
export const SKILL_POINTS_BUDGET = 21;

const SKILLS_BY_SPECIALIZATION: Record<string, Skill[]> = {
  isceleine: ISCELEINE_SKILLS,
  napadenie: NAPADENIE_SKILLS,
  misticizm: MISTICIZM_SKILLS,
  gnev: GNEV_SKILLS,
  presledovanie: PRESLEDOVANIE_SKILLS,
  skritnost: SKRITNOST_SKILLS,
  kovarstvo: KOVARSTVO_SKILLS,
  volshebstvo: VOLSHEBSTVO_SKILLS,
  oborona: OBORONA_SKILLS,
  tanec: TANEC_SKILLS,
  soprotivlenie: SOPROTIVLENIE_SKILLS,
  gipnoz: GIPNOZ_SKILLS,
  voodush: VOODUSH_SKILLS,
  strelba: STRELBA_SKILLS,
};

export function getSkillsForSpecialization(specializationId: string): Skill[] {
  return SKILLS_BY_SPECIALIZATION[specializationId] ?? [];
}

export function hasSkillData(specializationId: string): boolean {
  return (SKILLS_BY_SPECIALIZATION[specializationId]?.length ?? 0) > 0;
}

export function findSkill(
  specializationId: string,
  skillId: string,
): Skill | undefined {
  return getSkillsForSpecialization(specializationId).find(
    (s) => s.id === skillId,
  );
}
