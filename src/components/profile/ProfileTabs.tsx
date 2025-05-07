"use client";
import { useEffect, useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import InventoryTabsClient from "./inventory/InventoryTabsClient";
import TasksTable from "./tasks/TasksTable";
import UserNotes from "./notes/UserNotes";
import getUserInventory from "@/src/actions/getUserInventory";
import getUserTasks from "@/src/actions/getUserTasks";

export default function ProfileTabs({
  user,
  inventory: initialInventory,
  tasks: initialTasks,
  tags,
  setTags,
  setUser, 
}: {
  user: any;
  inventory: any[];
  tasks: any[];
  tags: any[];
  setTags: (tags: any[]) => void;
  setUser: (user: any) => void; 
}) {
  const [inventory, setInventory] = useState(initialInventory);
  const [tasks, setTasks] = useState(initialTasks);

  useEffect(() => {
    setInventory(initialInventory);
  }, [initialInventory]);

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  return (
    <Tabs defaultValue="inventory">
      <TabsList className="mb-4">
        <TabsTrigger value="inventory">Инвентарь</TabsTrigger>
        <TabsTrigger value="tasks">Задания</TabsTrigger>
        <TabsTrigger value="notes">Заметки</TabsTrigger>
      </TabsList>

      <TabsContent value="inventory">
        <InventoryTabsClient
          inventory={inventory}
          userId={user.id}
          onChange={async () => {
            const updatedInventory = await getUserInventory(user.id);
            setInventory(updatedInventory);
          }}
        />
      </TabsContent>

      <TabsContent value="tasks">
        <TasksTable
          tasks={tasks}
          userId={user.id}
          onChange={async () => {
            const updatedTasks = await getUserTasks(user.id);
            setTasks(updatedTasks);
          }}
        />
      </TabsContent>

      <TabsContent value="notes">
        <UserNotes
          user={user}
          initialTags={tags}
          updateTags={setTags}
          setUser={setUser} 
        />
      </TabsContent>
    </Tabs>
  );
}
