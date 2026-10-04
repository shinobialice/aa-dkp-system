"use server";
import sql from "@/shared/lib/db";
import type { UserRow } from "@/shared/lib/dbTypes";
import {
  parseSelectedBuffs,
  PERSONAL_BUFFS,
  pickBuffs,
  type SelectedBuffs,
} from "@/widgets/profile/equipment/characterBuffs";
import { equipmentForRole } from "@/widgets/profile/equipment/equipmentRoles";
import { getSessionUserId } from "./getSessionUserId";
import getUserEquipment, { type UserEquipment } from "./getUserEquipment";
import getUserSeals, { type UserSeal } from "./getUserSeals";
import getUserSkillBuild, { type RoleSkillBuild } from "./getUserSkillBuild";

export type ComparisonProfile = {
  equipment: UserEquipment[];
  seals: UserSeal[];
  buffs: SelectedBuffs;
  skillBuild: RoleSkillBuild;
  level: number;
};

const COMPARISON_ROLE = 1;

// Характеристики того, кто открыл чужой профиль, — чтобы показать разницу.
// Сравниваем с его основной ролью.
export async function getComparisonProfile(
  ownerId: number,
): Promise<ComparisonProfile | null> {
  const viewerId = await getSessionUserId();
  if (viewerId === null || viewerId === ownerId) return null;

  try {
    const [[viewer], seals, equipment, skillBuild] = await Promise.all([
      sql<Pick<UserRow, "character_level" | "character_buffs">[]>`
        SELECT character_level, character_buffs FROM "user" WHERE id = ${viewerId}
      `,
      getUserSeals(viewerId),
      getUserEquipment(viewerId),
      getUserSkillBuild(viewerId),
    ]);
    if (!viewer) return null;

    return {
      equipment: equipmentForRole(equipment, COMPARISON_ROLE),
      seals,
      buffs: pickBuffs(
        parseSelectedBuffs(viewer.character_buffs),
        PERSONAL_BUFFS,
      ),
      skillBuild: skillBuild[COMPARISON_ROLE],
      level: viewer.character_level,
    };
  } catch (error) {
    console.error("Ошибка при загрузке профиля для сравнения:", error);
    throw new Error("Не удалось загрузить характеристики для сравнения");
  }
}
