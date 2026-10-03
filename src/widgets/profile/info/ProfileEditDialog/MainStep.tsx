import { Plus } from "lucide-react";
import { Button } from "@/shared/ui";
import BasicFields from "./BasicFields";
import RoleCard, { type RoleErrors } from "./RoleCard";
import { roleExists } from "./profileDraft";
import type { FormPermissions, ProfileForm } from "./useProfileForm";

type Props = {
  form: ProfileForm;
  permissions: FormPermissions & {
    canEditVk: boolean;
    canEditJoinedAt: boolean;
  };
};

const NO_ERRORS: RoleErrors = { className: false, gs: false, archetype: false };

export default function MainStep({ form, permissions }: Props) {
  return (
    <div className="space-y-5 pb-1">
      <BasicFields
        draft={form.draft}
        onChange={form.updateDraft}
        usernameError={form.submitted && form.usernameError}
        canEditNickname={permissions.canEditNickname}
        canEditVk={permissions.canEditVk}
        canEditJoinedAt={permissions.canEditJoinedAt}
      />
      {form.visibleSlots.map((slot) => (
        <RoleCard
          key={slot}
          slot={slot}
          role={form.draft.roles[slot]}
          editable={form.isRoleEditable(slot)}
          removable={slot !== 1 && roleExists(form.user, slot)}
          filled={form.isRoleFilled(slot)}
          canEditArchetype={permissions.canEditArchetype}
          errors={form.submitted ? form.roleErrors(slot) : NO_ERRORS}
          onChange={(patch) => form.updateRole(slot, patch)}
        />
      ))}
      {permissions.canAddExtraRole && form.nextHiddenSlot && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="cursor-pointer"
          onClick={form.revealNextSlot}
        >
          <Plus className="size-4" />
          Ещё роль
        </Button>
      )}
    </div>
  );
}
