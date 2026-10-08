"use server";
import sql from "@/shared/lib/db";
import type { UserRow } from "@/shared/lib/dbTypes";
import type { RoleSlot } from "@/shared/config/roleSlots";
import {
  ROLE_SLOTS,
  hasRole,
  roleClassOf,
  roleTabLabel,
} from "@/widgets/profile/archetype/archetypeRoles";
import type { SelectedBuffs } from "@/widgets/profile/equipment/characterBuffs";
import { equipmentForRole } from "@/widgets/profile/equipment/equipmentRoles";
import { getSessionUserId } from "./getSessionUserId";
import getUserArchetype, { type ArchetypeSlot } from "./getUserArchetype";
import getUserCharacterBuffs from "./getUserCharacterBuffs";
import { getGuildBuffSettings } from "./guildBuffSettings";
import getUserEquipment, { type UserEquipment } from "./getUserEquipment";
import getUserSeals, { type UserSeal } from "./getUserSeals";
import getUserSkillBuild, { type RoleSkillBuild } from "./getUserSkillBuild";

export type CalculatorRole = {
  roleSlot: RoleSlot;
  label: string;
  roleClass: string | null;
  gearScore: number | null;
  equipment: UserEquipment[];
  buffs: SelectedBuffs;
  specializations: (string | null)[];
  skillBuild: RoleSkillBuild;
};

export type CalculatorPlayer = {
  id: number;
  username: string;
  avatarUrl: string | null;
  portraitUrl: string | null;
  level: number;
  seals: UserSeal[];
  roles: CalculatorRole[];
};

type PlayerRow = Pick<
  UserRow,
  | "id"
  | "username"
  | "avatar_url"
  | "character_portrait_url"
  | "class"
  | "secondary_class"
  | "tertiary_class"
  | "class_gear_score"
  | "secondary_class_gear_score"
  | "tertiary_class_gear_score"
  | "character_level"
>;

const GEAR_SCORE_FIELD: Record<
  RoleSlot,
  | "class_gear_score"
  | "secondary_class_gear_score"
  | "tertiary_class_gear_score"
> = {
  1: "class_gear_score",
  2: "secondary_class_gear_score",
  3: "tertiary_class_gear_score",
};

export async function getCalculatorPlayer(
  userId: number,
): Promise<CalculatorPlayer | null> {
  const viewerId = await getSessionUserId();
  if (viewerId === null) throw new Error("Нужно войти на сайт");
  return loadCalculatorPlayer(userId);
}

export async function getMyCalculatorPlayer(): Promise<CalculatorPlayer | null> {
  const viewerId = await getSessionUserId();
  if (viewerId === null) return null;
  return loadCalculatorPlayer(viewerId);
}

async function loadCalculatorPlayer(
  userId: number,
): Promise<CalculatorPlayer | null> {
  const [players, archetype, equipment, seals, buffs, skillBuild, guildBuffs] =
    await Promise.all([
      selectPlayer(userId),
      getUserArchetype(userId),
      getUserEquipment(userId),
      getUserSeals(userId),
      getUserCharacterBuffs(userId),
      getUserSkillBuild(userId),
      getGuildBuffSettings(),
    ]);
  const [player] = players;
  if (!player) return null;

  return {
    id: player.id,
    username: player.username,
    avatarUrl: player.avatar_url,
    portraitUrl: player.character_portrait_url,
    level: player.character_level,
    seals,
    roles: ROLE_SLOTS.filter((slot) => hasRole(player, slot)).map((slot) => ({
      roleSlot: slot,
      label: roleTabLabel(player, slot, archetype[slot]),
      roleClass: roleClassOf(player, slot),
      gearScore: player[GEAR_SCORE_FIELD[slot]],
      equipment: equipmentForRole(equipment, slot),
      buffs: { ...buffs[slot], ...guildBuffs },
      specializations: specializationsOf(archetype[slot]),
      skillBuild: skillBuild[slot],
    })),
  };
}

function specializationsOf(archetypeSlot: ArchetypeSlot): (string | null)[] {
  return [
    archetypeSlot.specialization1,
    archetypeSlot.specialization2,
    archetypeSlot.specialization3,
  ];
}

async function selectPlayer(userId: number) {
  try {
    return await sql<PlayerRow[]>`
      SELECT id, username, avatar_url, character_portrait_url,
        class, secondary_class, tertiary_class,
        class_gear_score, secondary_class_gear_score, tertiary_class_gear_score,
        character_level
      FROM "user"
      WHERE id = ${userId}
    `;
  } catch (error) {
    console.error("Ошибка при загрузке игрока для калькулятора:", error);
    throw new Error("Не удалось загрузить экипировку игрока");
  }
}
