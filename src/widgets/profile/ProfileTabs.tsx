"use client";
import { useEffect, useState } from "react";
import getUserInventory from "@/actions/getUserInventory";
import { UserActivityChart } from "@/widgets/profile/activity/UserActivityChart";
import { UserMonthActivity } from "@/widgets/profile/activity/UserMonthActivity";
import InventoryTabsClient from "./inventory/InventoryTabsClient";
import PurchasesAndGiveaways from "./inventory/PurchasesAndGiveaways";
import UserNotes from "./notes/UserNotes";
import SealsTab from "./seals/SealsTab";
import TasksTable from "./tasks/TasksTable";
import UsernameHistoryTab from "./usernameHistory/UsernameHistoryTab";
import UserMonthlyRaidsTab from "./raids/UserMonthlyRaidsTab";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/ui";

export default function ProfileTabs({
  user,
  inventory: initialInventory,
  tasks: initialTasks,
  seals,
  setSeals,
  tags,
  setTags,
  setUser,
  usernameHistory,
  averageGuildGS,
  isAdmin,
  canEditInventory,
}: {
  user: any;
  inventory: any[];
  tasks: any[];
  seals: any[];
  setSeals: (seals: any[]) => void;
  tags: any[];
  setTags: (tags: any[]) => void;
  setUser: (user: any) => void;
  usernameHistory: {
    id: number;
    old_username: string;
    new_username: string;
    changed_at: string;
  }[];
  averageGuildGS: number;
  isAdmin: boolean;
  canEditInventory: boolean;
}) {
  const [inventory, setInventory] = useState(initialInventory);
  const [tasks, setTasks] = useState(initialTasks);

  useEffect(() => {
    setInventory(initialInventory);
  }, [initialInventory]);

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const handleInventoryChange = async () => {
    const updated = await getUserInventory(user.id);
    setInventory(updated);
  };

  return (
    <Tabs defaultValue="inventory">
      <TabsList className="mb-4">
        <TabsTrigger className="cursor-pointer" value="inventory">
          Инвентарь
        </TabsTrigger>
        <TabsTrigger className="cursor-pointer" value="activity">
          Активность
        </TabsTrigger>
        <TabsTrigger className="cursor-pointer" value="raids">
          Рейды
        </TabsTrigger>
        <TabsTrigger className="cursor-pointer" value="notes">
          Заметки
        </TabsTrigger>
        <TabsTrigger className="cursor-pointer" value="purchases">
          Куплено/Выдано
        </TabsTrigger>
        <TabsTrigger className="cursor-pointer" value="username-history">
          История ников
        </TabsTrigger>
        <TabsTrigger className="cursor-pointer" value="tasks">
          Задания
        </TabsTrigger>
        <TabsTrigger className="cursor-pointer" value="seals">
          Печати
        </TabsTrigger>
      </TabsList>
      <TabsContent value="inventory">
        <InventoryTabsClient
          canEdit={canEditInventory}
          inventory={inventory}
          userId={user.id}
          onChange={handleInventoryChange}
        />
      </TabsContent>

      <TabsContent value="activity" className="space-y-6">
        <UserMonthActivity userId={user.id} />
        <UserActivityChart userId={user.id} />
      </TabsContent>

      <TabsContent value="raids">
        <UserMonthlyRaidsTab userId={user.id} />
      </TabsContent>

      <TabsContent value="notes">
        <UserNotes
          isAdmin={isAdmin}
          user={user}
          initialTags={tags}
          updateTags={setTags}
          setUser={setUser}
          averageGuildGS={averageGuildGS}
        />
      </TabsContent>

      <TabsContent value="purchases">
        <PurchasesAndGiveaways userId={user.id} username={user.username} />
      </TabsContent>

      <TabsContent value="username-history">
        <UsernameHistoryTab history={usernameHistory} />
      </TabsContent>

      <TabsContent value="tasks">
        <TasksTable
          isAdmin={isAdmin}
          tasks={tasks}
          userId={user.id}
          onChange={() => {
            // Handle tasks updates passed from parent
          }}
        />
      </TabsContent>

      <TabsContent value="seals">
        <SealsTab
          userId={user.id}
          seals={seals}
          onChange={setSeals}
          isAdmin={isAdmin}
        />
      </TabsContent>
    </Tabs>
  );
}
