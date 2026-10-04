import { useState } from "react";
import type { ProfileUser } from "@/actions/getUser";
import type { RoleSlot, UserArchetype } from "@/actions/getUserArchetype";
import { isArchetypeComplete } from "@/widgets/profile/archetype/ArchetypeSpecPicker";
import type { RoleErrors } from "./RoleCard";
import {
  ROLE_SLOTS,
  buildDraft,
  roleExists,
  type Draft,
  type RoleDraft,
} from "./profileDraft";

export type FormPermissions = {
  canEditNickname: boolean;
  canEditGs: boolean;
  canAddExtraRole: boolean;
  canEditArchetype: boolean;
  canSkipRequired: boolean;
};

export type ProfileForm = ReturnType<typeof useProfileForm>;

const NO_ROLE_ERRORS: RoleErrors = {
  className: false,
  gs: false,
  archetype: false,
};

export function useProfileForm(
  user: ProfileUser,
  archetype: UserArchetype,
  permissions: FormPermissions,
) {
  const [initial, setInitial] = useState(() => buildDraft(user, archetype));
  const [draft, setDraft] = useState(initial);
  const [revealedSlots, setRevealedSlots] = useState<RoleSlot[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const visibleSlots = ROLE_SLOTS.filter(
    (slot) => roleExists(user, slot) || revealedSlots.includes(slot),
  );
  const nextHiddenSlot = ROLE_SLOTS.find(
    (slot) => !visibleSlots.includes(slot),
  );

  const isRoleEditable = (slot: RoleSlot) =>
    slot === 1 || roleExists(user, slot)
      ? permissions.canEditGs
      : permissions.canAddExtraRole;
  const isRoleFilled = (slot: RoleSlot) =>
    slot === 1 || !!draft.roles[slot].className;

  const roleErrors = (slot: RoleSlot): RoleErrors => {
    if (permissions.canSkipRequired) return NO_ROLE_ERRORS;
    const role = draft.roles[slot];
    const editable = isRoleEditable(slot);
    const filled = isRoleFilled(slot);
    return {
      className: editable && slot === 1 && !role.className,
      gs: editable && filled && !role.gs,
      archetype:
        permissions.canEditArchetype &&
        filled &&
        !isArchetypeComplete(role.archetype),
    };
  };

  const usernameError = permissions.canEditNickname && !draft.username.trim();
  const hasErrors =
    usernameError ||
    visibleSlots.some((slot) => Object.values(roleErrors(slot)).some(Boolean));

  const updateDraft = (patch: Partial<Draft>) =>
    setDraft((current) => ({ ...current, ...patch }));

  const updateRole = (slot: RoleSlot, patch: Partial<RoleDraft>) =>
    setDraft((current) => ({
      ...current,
      roles: { ...current.roles, [slot]: { ...current.roles[slot], ...patch } },
    }));

  const revealNextSlot = () => {
    if (!nextHiddenSlot) return;
    setRevealedSlots((current) => [...current, nextHiddenSlot]);
  };

  const markSaved = () => {
    setInitial(draft);
    setSubmitted(false);
  };

  return {
    user,
    draft,
    initial,
    submitted,
    setSubmitted,
    visibleSlots,
    nextHiddenSlot,
    isRoleEditable,
    isRoleFilled,
    roleErrors,
    usernameError,
    hasErrors,
    updateDraft,
    updateRole,
    revealNextSlot,
    markSaved,
  };
}
