"use client";
import { useState } from "react";
import { UserActivityChart } from "@/widgets/profile/activity/UserActivityChart";
import { UserMonthActivity } from "@/widgets/profile/activity/UserMonthActivity";
import ProfileInfoClient from "@/widgets/profile/info/ProfileInfoClient";
import ProfileTabs from "@/widgets/profile/ProfileTabs";

export default function ProfilePageWrapper({
  user: initialUser,
  tags: initialTags,
  inventory,
  tasks,
  averageGuildGS,
  activity,
  isAdmin,
}: {
  user: any;
  tags: { id: number; tag: string }[];
  inventory: any[];
  tasks: any[];
  notes: any[];
  averageGuildGS: number;
  activity: {
    aglPercent: number;
    primePercent: number;
    totalPercent: number;
    dkp: number;
  };
  isAdmin: boolean;
}) {
  const [user, setUser] = useState(initialUser);
  const [tags, setTags] = useState(initialTags);

  return (
    <div className="space-y-8 p-4">
      <div className="grid grid-cols-3 gap-6 lg:grid-cols-2 items-start">
        <UserMonthActivity
          aglPercent={activity.aglPercent}
          primePercent={activity.primePercent}
          totalPercent={activity.totalPercent}
          dkp={activity.dkp}
        />
        <div>
          <UserActivityChart userId={user.id} />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 items-start">
        <ProfileInfoClient isAdmin={isAdmin} user={user} tags={tags} />
        <ProfileTabs
          user={user}
          setUser={setUser}
          inventory={inventory}
          tasks={tasks}
          tags={tags}
          setTags={setTags}
          averageGuildGS={averageGuildGS}
          isAdmin={isAdmin}
        />
      </div>
    </div>
  );
}
