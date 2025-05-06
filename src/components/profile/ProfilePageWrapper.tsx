"use client";
import { useEffect, useState } from "react";
import ProfileTabs from "@/src/components/profile/ProfileTabs";
import ProfileInfoClient from "@/src/components/profile/info/ProfileInfoClient";
import getTasks from "@/src/actions/getTasks";
import getUserInventory from "@/src/actions/getUserInventory";
import getUser from "@/src/actions/getUser";
import getUserNotes from "@/src/actions/getUserNotes";
import { UserActivityChart } from "@/src/components/profile/activity/UserActivityChart";
import { UserMonthActivity } from "@/src/components/profile/activity/UserMonthActivity";
import { getUserTags } from "@/src/actions/userTagsActions";

export default function ProfilePageWrapper({ userId }: { userId: number }) {
  const [user, setUser] = useState<any>(null);
  const [tags, setTags] = useState<{ id: number; tag: string }[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [tasks, setTasks] = useState<any[]>([]);
  const [notes, setNotes] = useState<any[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const [userData, tagsData, invData, tasksData, notesData] =
        await Promise.all([
          getUser(userId),
          getUserTags(userId),
          getUserInventory(userId),
          getTasks(userId),
          getUserNotes(userId),
        ]);
      setUser(userData);
      setTags(tagsData);
      setInventory(invData);
      setTasks(tasksData);
      setNotes(notesData);
    };

    loadData();
  }, [userId]);

  if (!user) return null;

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
          setUser={setUser} // ✅ добавь это
          inventory={inventory}
          tasks={tasks}
          tags={tags}
          setTags={setTags}
        />
      </div>
    </div>
  );
}
