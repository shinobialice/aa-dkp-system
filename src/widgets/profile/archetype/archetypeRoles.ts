import type { ProfileUser } from "@/actions/getUser";
import type { ArchetypeSlot, RoleSlot } from "@/actions/getUserArchetype";
import type { RoleSkillBuild } from "@/actions/getUserSkillBuild";

export const ROLE_LABELS: Record<RoleSlot, string> = {
  1: "Роль 1",
  2: "Роль 2",
  3: "Роль 3",
};

const ROLE_CLASS_FIELD: Record<
  RoleSlot,
  "class" | "secondary_class" | "tertiary_class"
> = {
  1: "class",
  2: "secondary_class",
  3: "tertiary_class",
};

export const ROLE_SLOTS: RoleSlot[] = [1, 2, 3];

export function roleClassOf(user: ProfileUser, slot: RoleSlot): string | null {
  return user[ROLE_CLASS_FIELD[slot]];
}

export function roleTabLabel(
  user: ProfileUser,
  slot: RoleSlot,
  archetypeSlot: ArchetypeSlot,
): string {
  return (
    archetypeSlot.className ?? roleClassOf(user, slot) ?? ROLE_LABELS[slot]
  );
}

// Роль 1 есть у всех, 2/3 — только если игрок их себе завёл (см. ProfileClasses).
export function hasRole(user: ProfileUser, slot: RoleSlot): boolean {
  if (slot === 1) return true;
  if (slot === 2) {
    return !!user.secondary_class || user.secondary_class_gear_score != null;
  }
  return !!user.tertiary_class || user.tertiary_class_gear_score != null;
}

export function specIdsOf(slot: ArchetypeSlot): string[] {
  return [
    slot.specialization1,
    slot.specialization2,
    slot.specialization3,
  ].filter((s): s is string => !!s);
}

export function hasAnySkillSelected(
  roleBuild: RoleSkillBuild | undefined,
): boolean {
  if (!roleBuild) return false;
  return Object.values(roleBuild).some(
    (spec) => (spec?.selected?.length ?? 0) > 0,
  );
}
