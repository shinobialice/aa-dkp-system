"use client";
import { useState } from "react";
import ProfileInfoClient from "@/widgets/profile/info/ProfileInfoClient";
import ProfileTabs from "@/widgets/profile/ProfileTabs";

export default function ProfilePageWrapper({
  user: initialUser,
  tags: initialTags,
  inventory,
  tasks,
  usernameHistory: initialUsernameHistory,
  averageGuildGS,
  activity,
  salary,
  isAdmin,
  canEditProfile,
  canEditInventory,
  isOwnProfile,
}: {
  user: any;
  tags: { id: number; tag: string }[];
  inventory: any[];
  tasks: any[];
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
  isAdmin: boolean;
  canEditProfile: boolean;
  canEditInventory: boolean;
  isOwnProfile: boolean;
}) {
  const [user, setUser] = useState(initialUser);
  const [tags, setTags] = useState(initialTags);
  const [usernameHistory, setUsernameHistory] = useState(
    initialUsernameHistory,
  );

  return (
    <div className="space-y-6 p-4">
      <ProfileInfoClient
        canEditProfile={canEditProfile}
        isOwnProfile={isOwnProfile}
        user={user}
        tags={tags}
        setUsernameHistory={setUsernameHistory}
        activity={activity}
        salary={salary}
      />
      <ProfileTabs
        user={user}
        setUser={setUser}
        inventory={inventory}
        tasks={tasks}
        tags={tags}
        setTags={setTags}
        usernameHistory={usernameHistory}
        averageGuildGS={averageGuildGS}
        isAdmin={isAdmin}
        canEditInventory={canEditInventory}
      />
    </div>
  );
}
