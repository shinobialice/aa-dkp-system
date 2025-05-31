// components/LootTable.tsx
"use client";
import { useState, useEffect } from "react";
import { AddLootDialog } from "./AddLootDialog";
import { ExpensesTable } from "./ExpenseTable";
import { LootItem, ItemType, NewLootItem } from "./LootTypes";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getLoot, addLootItem, getItemTypes } from "@/src/actions/lootActions";
import { deleteLootItem } from "@/src/actions/deleteLootItem";
import useUserTag from "@/src/hooks/useUserTag";
import { LootRawTable } from "./LootRawTable";
import { Button } from "@/components/ui/button";

export default function LootTable() {
  const [loot, setLoot] = useState<LootItem[]>([]);
  const [itemTypes, setItemTypes] = useState<ItemType[]>([]);
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [showDialog, setShowDialog] = useState(false);
  const isAdmin = useUserTag("Администратор");

  useEffect(() => {
    const loadData = async () => {
      setLoot(await getLoot());
      setItemTypes(await getItemTypes());
    };
    loadData();
  }, []);

  const handleAdd = async (item: NewLootItem) => {
    await addLootItem(item);
    setLoot(await getLoot());
  };

  const handleDelete = async (item: LootItem) => {
    await deleteLootItem(item.id);
    setLoot(await getLoot());
  };

  return (
    <Tabs defaultValue="income" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger className="cursor-pointer" value="income">
          Доходы
        </TabsTrigger>
        <TabsTrigger className="cursor-pointer" value="expenses">
          Расходы
        </TabsTrigger>
      </TabsList>
      <TabsContent value="income">
        <div className="space-y-4">
          {isAdmin && (
            <Button
              onClick={() => setShowDialog(true)}
              className="bg-primary cursor-pointer px-4 py-2 rounded"
            >
              Добавить доход
            </Button>
          )}
          <LootRawTable
            loot={loot}
            onDelete={handleDelete}
            onSell={(item) => {}}
          />
        </div>
        <AddLootDialog
          open={showDialog}
          onClose={() => setShowDialog(false)}
          onAdd={handleAdd}
          itemTypes={itemTypes}
        />
      </TabsContent>
      <TabsContent value="expenses">
        <ExpensesTable />
      </TabsContent>
    </Tabs>
  );
}
