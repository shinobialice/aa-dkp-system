import type { ProfileUser } from "@/actions/getUser";
import type {
  ArchetypeSlot,
  RoleSlot,
  UserArchetype,
} from "@/actions/getUserArchetype";
import { SPEC_KEYS } from "@/widgets/profile/archetype/ArchetypeSpecPicker";

export type RoleDraft = {
  className: string | null;
  gs: string;
  archetype: ArchetypeSlot;
};

export type Draft = {
  username: string;
  vkName: string;
  joinedAt: string;
  roles: Record<RoleSlot, RoleDraft>;
};

export type Step = "main" | "inventory";

export const ROLE_SLOTS: RoleSlot[] = [1, 2, 3];

export const ROLE_TITLES: Record<RoleSlot, string> = {
  1: "Основная роль",
  2: "Роль 2",
  3: "Роль 3",
};

type RoleColumns = {
  className: "class" | "secondary_class" | "tertiary_class";
  gs:
    | "class_gear_score"
    | "secondary_class_gear_score"
    | "tertiary_class_gear_score";
};

const ROLE_COLUMNS: Record<RoleSlot, RoleColumns> = {
  1: { className: "class", gs: "class_gear_score" },
  2: { className: "secondary_class", gs: "secondary_class_gear_score" },
  3: { className: "tertiary_class", gs: "tertiary_class_gear_score" },
};

export function roleExists(user: ProfileUser, slot: RoleSlot): boolean {
  if (slot === 1) return true;
  const columns = ROLE_COLUMNS[slot];
  return !!user[columns.className] || user[columns.gs] != null;
}

export function buildDraft(user: ProfileUser, archetype: UserArchetype): Draft {
  const roleDraft = (slot: RoleSlot): RoleDraft => {
    const columns = ROLE_COLUMNS[slot];
    return {
      className: user[columns.className] ?? null,
      gs: user[columns.gs]?.toString() ?? "",
      archetype: archetype[slot],
    };
  };

  return {
    username: user.username,
    vkName: user.vk_name ?? "",
    joinedAt: user.joined_at ? user.joined_at.slice(0, 10) : "",
    roles: { 1: roleDraft(1), 2: roleDraft(2), 3: roleDraft(3) },
  };
}

export function toGs(value: string): number | null {
  return value === "" ? null : Number(value);
}

export function archetypeChanged(a: ArchetypeSlot, b: ArchetypeSlot): boolean {
  return SPEC_KEYS.some((key) => (a[key] ?? null) !== (b[key] ?? null));
}

export function basicFieldsChanged(draft: Draft, initial: Draft) {
  return (
    draft.username !== initial.username ||
    draft.vkName !== initial.vkName ||
    draft.joinedAt !== initial.joinedAt ||
    ROLE_SLOTS.some(
      (slot) =>
        draft.roles[slot].className !== initial.roles[slot].className ||
        draft.roles[slot].gs !== initial.roles[slot].gs,
    )
  );
}
