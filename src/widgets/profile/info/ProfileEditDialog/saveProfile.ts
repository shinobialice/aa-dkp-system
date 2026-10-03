import type { ProfileUser } from "@/actions/getUser";
import type { UserArchetype } from "@/actions/getUserArchetype";
import editUser from "@/actions/editUser";
import getUser from "@/actions/getUser";
import saveUserArchetype from "@/actions/saveUserArchetype";
import { getUsernameHistory } from "@/actions/usernameHistoryActions";
import {
  ROLE_SLOTS,
  archetypeChanged,
  basicFieldsChanged,
  toGs,
  type Draft,
} from "./profileDraft";

export type SavedProfile = {
  user: ProfileUser;
  archetype: UserArchetype;
  usernameHistory: Awaited<ReturnType<typeof getUsernameHistory>>;
};

type SaveInput = {
  user: ProfileUser;
  archetype: UserArchetype;
  draft: Draft;
  initial: Draft;
  canEditNickname: boolean;
  canEditArchetype: boolean;
  isRoleFilled: (slot: (typeof ROLE_SLOTS)[number]) => boolean;
};

export async function saveProfile({
  user,
  archetype,
  draft,
  initial,
  canEditNickname,
  canEditArchetype,
  isRoleFilled,
}: SaveInput): Promise<SavedProfile> {
  if (basicFieldsChanged(draft, initial)) {
    const { roles } = draft;
    await editUser(
      user.id,
      canEditNickname ? draft.username.trim() : user.username,
      roles[1].className,
      toGs(roles[1].gs),
      roles[2].className,
      toGs(roles[2].gs),
      roles[3].className,
      toGs(roles[3].gs),
      draft.vkName.trim() || null,
      draft.joinedAt === initial.joinedAt
        ? user.joined_at
        : draft.joinedAt || null,
    );
  }

  let nextArchetype = archetype;
  if (canEditArchetype) {
    for (const slot of ROLE_SLOTS) {
      const role = draft.roles[slot];
      if (!isRoleFilled(slot)) continue;
      if (!archetypeChanged(role.archetype, archetype[slot])) continue;
      nextArchetype = await saveUserArchetype(user.id, slot, {
        specialization1: role.archetype.specialization1,
        specialization2: role.archetype.specialization2,
        specialization3: role.archetype.specialization3,
      });
    }
  }

  const [freshUser, usernameHistory] = await Promise.all([
    getUser(user.id),
    getUsernameHistory(user.id),
  ]);
  if (!freshUser) throw new Error("Игрок не найден");
  return { user: freshUser, archetype: nextArchetype, usernameHistory };
}
