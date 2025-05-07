"use client";
import { useState } from "react";
import ProfileTabs from "@/src/components/profile/ProfileTabs";
import ProfileInfoClient from "@/src/components/profile/info/ProfileInfoClient";
import { UserActivityChart } from "@/src/components/profile/activity/UserActivityChart";
import { UserMonthActivity } from "@/src/components/profile/activity/UserMonthActivity";

export default function ProfilePageWrapper({
  user: initialUser,
  tags: initialTags,
  inventory,
  tasks,
  notes,
  averageGuildGS
}: {
  user: any;
  tags: { id: number; tag: string }[];
  inventory: any[];
  tasks: any[];
  notes: any[];
  averageGuildGS: number;
}) {
  const [user, setUser] = useState(initialUser);
  const [tags, setTags] = useState(initialTags);

  return (
    <div className="space-y-8 p-4">
      <div className="grid grid-cols-3 gap-6 lg:grid-cols-2 items-start">
        <UserMonthActivity
          aglPercent={72}
          primePercent={85}
          totalPercent={80}
          dkp={120}
        />
        <div>
          <UserActivityChart userId={user.id} />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 items-start">
        <ProfileInfoClient user={user} tags={tags} />
        <ProfileTabs
          user={user}
          setUser={setUser}
          inventory={inventory}
          tasks={tasks}
          tags={tags}
          setTags={setTags}
          averageGuildGS={averageGuildGS}
        />
      </div>
    </div>
  );
}
