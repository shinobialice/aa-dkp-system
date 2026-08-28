"use client";
import { useState } from "react";
import type { PrimeStreak } from "@/actions/getUserPrimeStreak";
import type { UserArchetype } from "@/actions/getUserArchetype";
import ProfileInfoClient from "@/widgets/profile/info/ProfileInfoClient";
import ProfileTabs from "@/widgets/profile/ProfileTabs";

export default function ProfilePageWrapper({
  user: initialUser,
  tags: initialTags,
  inventory,
  seals: initialSeals,
  archetype: initialArchetype,
  usernameHistory: initialUsernameHistory,
  averageGuildGS,
  activity,
  salary,
  primeStreak,
  isAdmin,
  canEditProfile,
  canEditNickname,
  canEditGs,
  canAddExtraRole,
  canEditAdminFields,
  canEditInventory,
  canEditSeals,
  canEditArchetype,
  isOwnProfile,
}: {
  user: any;
  tags: { id: number; tag: string }[];
  inventory: any[];
  seals: any[];
  archetype: UserArchetype;
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
  isAdmin: boolean;
  canEditProfile: boolean;
  canEditNickname: boolean;
  canEditGs: boolean;
  canAddExtraRole: boolean;
  canEditAdminFields: boolean;
  canEditInventory: boolean;
  canEditSeals: boolean;
  canEditArchetype: boolean;
  isOwnProfile: boolean;
}) {
  const [user, setUser] = useState(initialUser);
  const [tags, setTags] = useState(initialTags);
  const [seals, setSeals] = useState(initialSeals);
  const [archetype, setArchetype] = useState(initialArchetype);
  const [usernameHistory, setUsernameHistory] = useState(
    initialUsernameHistory,
  );

  return (
    <div className="-mt-4 space-y-6 px-4 pb-4">
      <ProfileInfoClient
        canEditProfile={canEditProfile}
        canEditNickname={canEditNickname}
        canEditGs={canEditGs}
        canAddExtraRole={canAddExtraRole}
        canEditAdminFields={canEditAdminFields}
        isOwnProfile={isOwnProfile}
        user={user}
        tags={tags}
        seals={seals}
        archetype={archetype}
        setUsernameHistory={setUsernameHistory}
        activity={activity}
        salary={salary}
        primeStreak={primeStreak}
      />
      <ProfileTabs
        user={user}
        setUser={setUser}
        inventory={inventory}
        seals={seals}
        setSeals={setSeals}
        archetype={archetype}
        setArchetype={setArchetype}
        tags={tags}
        setTags={setTags}
        usernameHistory={usernameHistory}
        averageGuildGS={averageGuildGS}
        isAdmin={isAdmin}
        canEditInventory={canEditInventory}
        canEditSeals={canEditSeals}
        canEditArchetype={canEditArchetype}
      />
    </div>
  );
}
