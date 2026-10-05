"use client";
import type { ProfileUser } from "@/actions/getUser";
import type { InventoryItem } from "@/actions/getUserInventory";
import type { UserSeal } from "@/actions/getUserSeals";
import type { ProfileTag } from "@/widgets/profile/profileTypes";
import type { UserArchetype } from "@/actions/getUserArchetype";
import type { UserSkillBuild } from "@/actions/getUserSkillBuild";
import type { UserCharacterBuffs } from "@/actions/getUserCharacterBuffs";
import type { UserEquipment } from "@/actions/getUserEquipment";
import ProfileAttendanceTab from "./activity/ProfileAttendanceTab";
import InventoryTabsClient from "./inventory/InventoryTabsClient";
import PurchasesAndGiveaways from "./inventory/PurchasesAndGiveaways";
import ProfileSalaryTab from "./notes/ProfileSalaryTab";
import SealsTab from "./seals/SealsTab";
import CharacterRoleTabs from "./CharacterRoleTabs";
import { epheEquipmentView } from "./equipment/equipmentRoles";
import EpheSealsTab from "./ephe/EpheSealsTab";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/ui";

const TABS = [
  { value: "inventory", label: "Инвентарь" },
  { value: "attendance", label: "Посещаемость" },
  { value: "salary", label: "Зарплата" },
  { value: "purchases", label: "Покупки" },
  { value: "seals", label: "Печати" },
  { value: "character", label: "Персонаж" },
];

export default function ProfileTabs({
  tab,
  onTabChange,
  user,
  inventory,
  seals,
  setSeals,
  archetype,
  setArchetype,
  skillBuild,
  setSkillBuild,
  characterBuffs,
  setCharacterBuffs,
  equipment,
  setEquipment,
  tags,
  setTags,
  setUser,
  salary,
  averageGuildGS,
  isAdmin,
  canEditSeals,
  canEditArchetype,
  canEditEquipment,
}: {
  tab: string;
  onTabChange: (tab: string) => void;
  user: ProfileUser;
  inventory: InventoryItem[];
  seals: UserSeal[];
  setSeals: (seals: UserSeal[]) => void;
  archetype: UserArchetype;
  setArchetype: (archetype: UserArchetype) => void;
  skillBuild: UserSkillBuild;
  setSkillBuild: (skillBuild: UserSkillBuild) => void;
  characterBuffs: UserCharacterBuffs;
  setCharacterBuffs: (characterBuffs: UserCharacterBuffs) => void;
  equipment: UserEquipment[];
  setEquipment: (equipment: UserEquipment[]) => void;
  tags: ProfileTag[];
  setTags: (tags: ProfileTag[]) => void;
  setUser: (user: ProfileUser) => void;
  salary: number | null;
  averageGuildGS: number;
  isAdmin: boolean;
  canEditSeals: boolean;
  canEditArchetype: boolean;
  canEditEquipment: boolean;
}) {
  return (
    <Tabs value={tab} onValueChange={onTabChange} className="min-w-0 gap-3">
      <div className="-mx-4 overflow-x-auto px-4 [scrollbar-width:none] sm:mx-0 sm:px-0">
        <TabsList className="h-10">
          {TABS.map((item) => (
            <TabsTrigger
              key={item.value}
              className="cursor-pointer px-3.5"
              value={item.value}
            >
              {item.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <TabsContent value="inventory">
        <InventoryTabsClient inventory={inventory} userId={user.id} />
      </TabsContent>

      <TabsContent value="attendance">
        <ProfileAttendanceTab userId={user.id} />
      </TabsContent>

      <TabsContent value="salary">
        <ProfileSalaryTab
          isAdmin={isAdmin}
          user={user}
          salary={salary}
          tags={tags}
          setTags={setTags}
          setUser={setUser}
          averageGuildGS={averageGuildGS}
        />
      </TabsContent>

      <TabsContent value="purchases">
        <PurchasesAndGiveaways userId={user.id} username={user.username} />
      </TabsContent>

      <TabsContent value="seals" className="min-w-0">
        <Tabs defaultValue="ephe">
          <TabsContent value="ephe">
            <EpheSealsTab
              userId={user.id}
              equipment={epheEquipmentView(equipment)}
              onChange={setEquipment}
              canEdit={canEditEquipment}
            />
          </TabsContent>

          <TabsContent value="hero">
            <SealsTab
              userId={user.id}
              seals={seals}
              onChange={setSeals}
              canEdit={canEditSeals}
            />
          </TabsContent>
        </Tabs>
      </TabsContent>

      <TabsContent value="character" className="min-w-0">
        <CharacterRoleTabs
          user={user}
          archetype={archetype}
          onArchetypeChange={setArchetype}
          skillBuild={skillBuild}
          onSkillBuildChange={setSkillBuild}
          characterBuffs={characterBuffs}
          onCharacterBuffsChange={setCharacterBuffs}
          equipment={equipment}
          onEquipmentChange={setEquipment}
          seals={seals}
          canEditEquipment={canEditEquipment}
          canEditArchetype={canEditArchetype}
        />
      </TabsContent>
    </Tabs>
  );
}
