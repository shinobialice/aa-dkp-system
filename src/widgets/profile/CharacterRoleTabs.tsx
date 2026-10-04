import type { ProfileUser } from "@/actions/getUser";
import type { UserArchetype } from "@/actions/getUserArchetype";
import type { UserEquipment } from "@/actions/getUserEquipment";
import type { UserSeal } from "@/actions/getUserSeals";
import type { UserSkillBuild } from "@/actions/getUserSkillBuild";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui";
import ClassArchetypeTab from "./archetype/ClassArchetypeTab";
import { hasRole, ROLE_SLOTS, roleTabLabel } from "./archetype/archetypeRoles";
import EquipmentTab from "./equipment/EquipmentTab";
import {
  equipmentForRole,
  type EquipmentCopySource,
} from "./equipment/equipmentRoles";
import type { RoleSlot } from "@/shared/config/roleSlots";

type Props = {
  user: ProfileUser;
  archetype: UserArchetype;
  onArchetypeChange: (archetype: UserArchetype) => void;
  skillBuild: UserSkillBuild;
  onSkillBuildChange: (skillBuild: UserSkillBuild) => void;
  equipment: UserEquipment[];
  onEquipmentChange: (equipment: UserEquipment[]) => void;
  seals: UserSeal[];
  canEditEquipment: boolean;
  canEditArchetype: boolean;
};

export default function CharacterRoleTabs(props: Props) {
  const {
    user,
    archetype,
    onArchetypeChange,
    skillBuild,
    onSkillBuildChange,
    equipment,
    onEquipmentChange,
    seals,
    canEditEquipment,
    canEditArchetype,
  } = props;
  const roles = ROLE_SLOTS.filter((slot) => hasRole(user, slot));

  return (
    <Tabs defaultValue="1" className="gap-3">
      <TabsList className="max-w-full justify-start overflow-x-auto [scrollbar-width:none]">
        {roles.map((slot) => (
          <TabsTrigger
            key={slot}
            className="shrink-0 cursor-pointer px-3"
            value={String(slot)}
          >
            {roleTabLabel(user, slot, archetype[slot])}
          </TabsTrigger>
        ))}
      </TabsList>

      {roles.map((slot) => (
        <TabsContent key={slot} value={String(slot)} className="min-w-0">
          <Tabs defaultValue="equipment">
            <TabsContent value="equipment">
              <EquipmentTab
                userId={user.id}
                roleSlot={slot}
                copySources={copySourcesFor(slot, roles, props)}
                user={user}
                equipment={equipmentForRole(equipment, slot)}
                seals={seals}
                skillBuild={skillBuild[slot]}
                onChange={onEquipmentChange}
                canEdit={canEditEquipment}
              />
            </TabsContent>
            <TabsContent value="class">
              <ClassArchetypeTab
                userId={user.id}
                roleSlot={slot}
                archetype={archetype}
                onChange={onArchetypeChange}
                skillBuild={skillBuild}
                onSkillBuildChange={onSkillBuildChange}
                canEdit={canEditArchetype}
              />
            </TabsContent>
          </Tabs>
        </TabsContent>
      ))}
    </Tabs>
  );
}

function copySourcesFor(
  target: RoleSlot,
  roles: RoleSlot[],
  { user, archetype, equipment }: Props,
): EquipmentCopySource[] {
  return roles
    .filter(
      (slot) => slot !== target && equipmentForRole(equipment, slot).length > 0,
    )
    .map((slot) => ({
      roleSlot: slot,
      label: roleTabLabel(user, slot, archetype[slot]),
    }));
}
