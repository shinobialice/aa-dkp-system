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
}: {
  user: any;
  inventory: any[];
  tasks: any[];
}) {
  const [inventory, setInventory] = useState<any[]>(initialInventory);
  const [tasks, setTasks] = useState<any[]>(initialTasks);

  useEffect(() => {
    setInventory(initialInventory);
  }, [initialInventory]);

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
            const inventory = await getUserInventory(user.id);
            setInventory(inventory);
          }}
        />
      </TabsContent>

      <TabsContent value="tasks">
        <TasksTable
          tasks={tasks}
          userId={user.id}
          onChange={async () => {
            const tasks = await getUserTasks(user.id);
            setTasks(tasks);
          }}
        />
      </TabsContent>

      <TabsContent value="notes">
        <UserNotes user={user} />
      </TabsContent>
    </Tabs>
  );
}
