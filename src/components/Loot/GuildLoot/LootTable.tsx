"use client";
import { useState, useEffect } from "react";
import { AddLootDialog } from "./AddLootDialog";
import { ExpensesTable } from "./ExpenseTable";
import { groupLootItems } from "./groupLootItems";
import { LootGroupedTable } from "./LootGroupedTable";
import { LootTableControls } from "./LootTableControls";
import { LootItem, ItemType, NewLootItem } from "./LootTypes";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { getLoot, addLootItem, getItemTypes } from "@/src/actions/lootActions";
import { useUserTag } from "@/src/hooks/useUserTag";

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

  const groupedLoot = groupLootItems(loot);

  return (
    <Tabs defaultValue="income" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="income">Доходы</TabsTrigger>
        <TabsTrigger value="expenses">Расходы</TabsTrigger>
      </TabsList>
      {/* Доходы */}
      <TabsContent value="income">
        <div>
          <div className="space-y-4">
            {isAdmin && (
              <LootTableControls
                month={month}
                year={year}
                onMonthChange={setMonth}
                onYearChange={setYear}
                onAddClick={() => setShowDialog(true)}
                label="Добавить доход"
              />
            )}
            <LootGroupedTable
              groupedLoot={groupedLoot}
              loot={loot}
              setLoot={setLoot}
            />
          </div>
        </div>
        <AddLootDialog
          open={showDialog}
          onClose={() => setShowDialog(false)}
          onAdd={handleAdd}
          itemTypes={itemTypes}
        />
      </TabsContent>
      {/* Расходы */}

      <TabsContent value="expenses">
        <div>
          <div>
            <ExpensesTable />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
