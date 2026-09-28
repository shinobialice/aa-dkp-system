"use client";
import { useState } from "react";
import getUserInventory from "@/actions/getUserInventory";
import type { PrimeStreak } from "@/actions/getUserPrimeStreak";
import type { KillcountStats } from "@/actions/getUserKillcountStats";
import type { UserArchetype } from "@/actions/getUserArchetype";
import type { UserSkillBuild } from "@/actions/getUserSkillBuild";
import type { UserEquipment } from "@/actions/getUserEquipment";
import ProfileInfoClient from "@/widgets/profile/info/ProfileInfoClient";
import ProfileTabs from "@/widgets/profile/ProfileTabs";

export default function ProfilePageWrapper({
  user: initialUser,
  tags: initialTags,
  inventory: initialInventory,
  seals: initialSeals,
  archetype: initialArchetype,
  skillBuild: initialSkillBuild,
  equipment: initialEquipment,
  usernameHistory: initialUsernameHistory,
  averageGuildGS,
  activity,
  salary,
  primeStreak,
  killcountStats,
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
  user: any;
  tags: { id: number; tag: string }[];
  inventory: any[];
  seals: any[];
  archetype: UserArchetype;
  skillBuild: UserSkillBuild;
  equipment: UserEquipment[];
  notes: any[];
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
  const [equipment, setEquipment] = useState(initialEquipment);
  const [usernameHistory, setUsernameHistory] = useState(
    initialUsernameHistory,
  );
  const [inventory, setInventory] = useState(initialInventory);

  const reloadInventory = async () => {
    setInventory(await getUserInventory(user.id));
  };

  return (
    <div className="-mt-4 space-y-6 px-4 pb-4">
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
      />
      <ProfileTabs
        user={user}
        setUser={setUser}
        inventory={inventory}
        seals={seals}
        setSeals={setSeals}
        archetype={archetype}
        setArchetype={setArchetype}
        skillBuild={skillBuild}
        setSkillBuild={setSkillBuild}
        equipment={equipment}
        setEquipment={setEquipment}
        tags={tags}
        setTags={setTags}
        averageGuildGS={averageGuildGS}
        isAdmin={isAdmin}
        canEditSeals={canEditSeals}
        canEditArchetype={canEditArchetype}
        canEditEquipment={canEditEquipment}
      />
    </div>
  );
}
