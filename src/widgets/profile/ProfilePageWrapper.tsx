"use client";
import { useState } from "react";
import type { PrimeStreak } from "@/actions/getUserPrimeStreak";
import ProfileInfoClient from "@/widgets/profile/info/ProfileInfoClient";
import ProfileTabs from "@/widgets/profile/ProfileTabs";

export default function ProfilePageWrapper({
  user: initialUser,
  tags: initialTags,
  inventory,
  tasks,
  seals: initialSeals,
  usernameHistory: initialUsernameHistory,
  averageGuildGS,
  activity,
  salary,
  primeStreak,
  isAdmin,
  canEditProfile,
  canEditNickname,
  canEditGs,
  canEditAdminFields,
  canEditInventory,
  canEditSeals,
  isOwnProfile,
}: {
  user: any;
  tags: { id: number; tag: string }[];
  inventory: any[];
  tasks: any[];
  seals: any[];
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
  canEditAdminFields: boolean;
  canEditInventory: boolean;
  canEditSeals: boolean;
  isOwnProfile: boolean;
}) {
  const [user, setUser] = useState(initialUser);
  const [tags, setTags] = useState(initialTags);
  const [seals, setSeals] = useState(initialSeals);
  const [usernameHistory, setUsernameHistory] = useState(
    initialUsernameHistory,
  );

  return (
    <div className="-mt-4 space-y-6 px-4 pb-4">
      <ProfileInfoClient
        canEditProfile={canEditProfile}
        canEditNickname={canEditNickname}
        canEditGs={canEditGs}
        canEditAdminFields={canEditAdminFields}
        isOwnProfile={isOwnProfile}
        user={user}
        tags={tags}
        seals={seals}
        setUsernameHistory={setUsernameHistory}
        activity={activity}
        salary={salary}
        primeStreak={primeStreak}
      />
      <ProfileTabs
        user={user}
        setUser={setUser}
        inventory={inventory}
        tasks={tasks}
        seals={seals}
        setSeals={setSeals}
        tags={tags}
        setTags={setTags}
        usernameHistory={usernameHistory}
        averageGuildGS={averageGuildGS}
        isAdmin={isAdmin}
        canEditInventory={canEditInventory}
        canEditSeals={canEditSeals}
      />
    </div>
  );
}
