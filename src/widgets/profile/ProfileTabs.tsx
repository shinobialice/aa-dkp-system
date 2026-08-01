"use client";
import { useEffect, useState } from "react";
import getUserInventory from "@/actions/getUserInventory";
import InventoryTabsClient from "./inventory/InventoryTabsClient";
import UserNotes from "./notes/UserNotes";
import TasksTable from "./tasks/TasksTable";
import UsernameHistoryTab from "./usernameHistory/UsernameHistoryTab";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/ui";

export default function ProfileTabs({
  user,
  inventory: initialInventory,
  tasks: initialTasks,
  tags,
  setTags,
  setUser,
  usernameHistory,
  averageGuildGS,
  isAdmin,
}: {
  user: any;
  inventory: any[];
  tasks: any[];
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
        <TabsTrigger className="cursor-pointer" value="tasks">
          Задания
        </TabsTrigger>
        <TabsTrigger className="cursor-pointer" value="notes">
          Заметки
        </TabsTrigger>
        <TabsTrigger className="cursor-pointer" value="username-history">
          История ников
        </TabsTrigger>
      </TabsList>
      <TabsContent value="inventory">
        <InventoryTabsClient
          isAdmin={isAdmin}
          inventory={inventory}
          userId={user.id}
          onChange={handleInventoryChange}
        />
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

      <TabsContent value="username-history">
        <UsernameHistoryTab history={usernameHistory} />
      </TabsContent>
    </Tabs>
  );
}
