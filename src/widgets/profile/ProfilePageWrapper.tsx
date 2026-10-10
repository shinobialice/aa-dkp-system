"use client";
import type { ProfileUser } from "@/actions/getUser";
import type { InventoryItem } from "@/actions/getUserInventory";
import { useState } from "react";
import type { UserSeal } from "@/actions/getUserSeals";
import getUserInventory from "@/actions/getUserInventory";
import type { PrimeStreak } from "@/actions/getUserPrimeStreak";
import type { KillcountStats } from "@/actions/getUserKillcountStats";
import type { ProfileStyle } from "@/actions/profileStyle";
import type { UserArchetype } from "@/actions/getUserArchetype";
import type { UserSkillBuild } from "@/actions/getUserSkillBuild";
import type { UserCharacterBuffs } from "@/actions/getUserCharacterBuffs";
import type { UserEquipment } from "@/actions/getUserEquipment";
import type { UserEpheSeals } from "@/actions/getUserEpheSeals";
import ProfileInfoClient from "@/widgets/profile/info/ProfileInfoClient";
import ProfileTabs from "@/widgets/profile/ProfileTabs";

export default function ProfilePageWrapper({
  user: initialUser,
  tags: initialTags,
  inventory: initialInventory,
  seals: initialSeals,
  archetype: initialArchetype,
  skillBuild: initialSkillBuild,
  characterBuffs: initialCharacterBuffs,
  equipment: initialEquipment,
  epheSeals: initialEpheSeals,
  usernameHistory: initialUsernameHistory,
  averageGuildGS,
  activity,
  salary,
  primeStreak,
  killcountStats,
  profileStyle,
  isAdmin,
  canEditProfile,
  canEditNickname,
  canEditGs,
  canAddExtraRole,
  canEditAdminFields,
  canEditVk,
  canEditInventory,
  canEditSeals,
  canEditArchetype,
  canEditEquipment,
  isOwnProfile,
}: {
  user: ProfileUser;
  tags: { id: number; tag: string }[];
  inventory: InventoryItem[];
  seals: UserSeal[];
  archetype: UserArchetype;
  skillBuild: UserSkillBuild;
  characterBuffs: UserCharacterBuffs;
  equipment: UserEquipment[];
  epheSeals: UserEpheSeals;
  usernameHistory: {
    id: number;
    old_username: string;
    new_username: string;
    changed_at: string;
  }[];
  averageGuildGS: number;
  activity: {
    aglPercent: number;
    primePercent: number;
    totalPercent: number;
    dkp: number;
    totalPointsAvailable: number;
  };
  salary: number | null;
  primeStreak: PrimeStreak;
  killcountStats: KillcountStats | null;
  profileStyle: ProfileStyle;
  isAdmin: boolean;
  canEditProfile: boolean;
  canEditNickname: boolean;
  canEditGs: boolean;
  canAddExtraRole: boolean;
  canEditAdminFields: boolean;
  canEditVk: boolean;
  canEditInventory: boolean;
  canEditSeals: boolean;
  canEditArchetype: boolean;
  canEditEquipment: boolean;
  isOwnProfile: boolean;
}) {
  const [user, setUser] = useState(initialUser);
  const [tags, setTags] = useState(initialTags);
  const [seals, setSeals] = useState(initialSeals);
  const [archetype, setArchetype] = useState(initialArchetype);
  const [skillBuild, setSkillBuild] = useState(initialSkillBuild);
  const [characterBuffs, setCharacterBuffs] = useState(initialCharacterBuffs);
  const [equipment, setEquipment] = useState(initialEquipment);
  const [epheSeals, setEpheSeals] = useState(initialEpheSeals);
  const [usernameHistory, setUsernameHistory] = useState(
    initialUsernameHistory,
  );
  const [inventory, setInventory] = useState(initialInventory);
  const [tab, setTab] = useState("inventory");

  const reloadInventory = async () => {
    setInventory(await getUserInventory(user.id));
  };

  return (
    <div className="mx-auto flex w-full max-w-6xl min-w-0 flex-col gap-4">
      <ProfileInfoClient
        canEditProfile={canEditProfile}
        canEditNickname={canEditNickname}
        canEditGs={canEditGs}
        canAddExtraRole={canAddExtraRole}
        canEditAdminFields={canEditAdminFields}
        canEditVk={canEditVk}
        canEditArchetype={canEditArchetype}
        canEditInventory={canEditInventory}
        isOwnProfile={isOwnProfile}
        isAdmin={isAdmin}
        onOpenSalary={() => setTab("salary")}
        user={user}
        setUser={setUser}
        tags={tags}
        seals={seals}
        archetype={archetype}
        setArchetype={setArchetype}
        inventory={inventory}
        onInventoryChange={reloadInventory}
        usernameHistory={usernameHistory}
        setUsernameHistory={setUsernameHistory}
        activity={activity}
        salary={salary}
        primeStreak={primeStreak}
        killcountStats={killcountStats}
        profileStyle={profileStyle}
      />
      <ProfileTabs
        tab={tab}
        onTabChange={setTab}
        user={user}
        setUser={setUser}
        inventory={inventory}
        seals={seals}
        setSeals={setSeals}
        archetype={archetype}
        setArchetype={setArchetype}
        skillBuild={skillBuild}
        setSkillBuild={setSkillBuild}
        characterBuffs={characterBuffs}
        setCharacterBuffs={setCharacterBuffs}
        equipment={equipment}
        setEquipment={setEquipment}
        epheSeals={epheSeals}
        setEpheSeals={setEpheSeals}
        tags={tags}
        setTags={setTags}
        salary={salary}
        averageGuildGS={averageGuildGS}
        isAdmin={isAdmin}
        canEditSeals={canEditSeals}
        canEditArchetype={canEditArchetype}
        canEditEquipment={canEditEquipment}
      />
    </div>
  );
}
