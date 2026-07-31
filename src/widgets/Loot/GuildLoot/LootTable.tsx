"use client";
import { useState, useEffect } from "react";
import { AddLootDialog } from "./AddLootDialog";

import { LootItem, ItemType, NewLootItem } from "./LootTypes";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/ui";
import { getLoot, addLootItem, getItemTypes } from "@/actions/lootActions";
import { deleteLootItem } from "@/actions/deleteLootItem";
import { LootRawTable } from "./LootRawTable";
import { MiscLootSummary } from "./MiscLootSummary";
import { LootTableControls } from "./LootTableControls";
import ExpensesTable from "./ExpenseTable";

type Props = {
  isAdmin: boolean; // Add isAdmin prop
};

export default function LootTable({ isAdmin }: Props) {
  const [loot, setLoot] = useState<LootItem[]>([]);
  const [itemTypes, setItemTypes] = useState<ItemType[]>([]);
  const [showDialog, setShowDialog] = useState(false);
  const now = new Date();
  const [selectedMonth, setSelectedMonth] = useState(now.getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(now.getFullYear());

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
          <LootTableControls
            isAdmin={isAdmin}
            month={selectedMonth}
            year={selectedYear}
            onMonthChange={setSelectedMonth}
            onYearChange={setSelectedYear}
            onAddClick={() => setShowDialog(true)}
            label="Добавить доход"
          />
          <MiscLootSummary
            isAdmin={isAdmin}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
          />
          <LootRawTable
            isAdmin={isAdmin}
            loot={loot}
            onDelete={handleDelete}
            onSell={(item) => {}}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
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
        <ExpensesTable isAdmin={isAdmin} />
      </TabsContent>
    </Tabs>
  );
}
