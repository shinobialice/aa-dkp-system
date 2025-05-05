"use client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState, useEffect } from "react";
import {
  getLoot,
  sellLootItem,
  addLootItem,
  getItemTypes,
} from "@/src/actions/lootActions";
import { LootItem, ItemType, NewLootItem } from "./LootTypes";
import { groupLoot } from "./groupLoot";
import { LootTableControls } from "./LootTableControls";
import { LootGroupedTable } from "./LootGroupedTable";
import { AddLootDialog } from "./AddLootDialog";
import { ExpensesTable } from "./ExpenseTable";

// Тип расхода
type ExpenseItem = {
  date: string;
  amount: number;
  target: string;
  source: string;
  comment: string;
};

export default function LootTable() {
  const [loot, setLoot] = useState<LootItem[]>([]);
  const [itemTypes, setItemTypes] = useState<ItemType[]>([]);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);

  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoot(await getLoot());
      setItemTypes(await getItemTypes());
    };
    loadData();
  }, []);

  const handleSell = async (id: number) => {
    await sellLootItem(id);
    setLoot(await getLoot());
  };

  const handleAdd = async (item: NewLootItem) => {
    await addLootItem(item);
    setLoot(await getLoot());
  };

  const grouped = groupLoot(loot, month, year);
  const filteredExpenses = expenses.filter((e) => {
    const d = new Date(e.date);
    return d.getMonth() + 1 === month && d.getFullYear() === year;
  });

  return (
    <Tabs defaultValue="income" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="income">Доходы</TabsTrigger>
        <TabsTrigger value="expenses">Расходы</TabsTrigger>
      </TabsList>
      {/* Доходы */}
      <TabsContent value="income">
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2 space-y-4">
            <LootTableControls
              month={month}
              year={year}
              onMonthChange={setMonth}
              onYearChange={setYear}
              onAddClick={() => setShowDialog(true)}
            />
            <LootGroupedTable
              groupedLoot={grouped}
              loot={loot}
              onSell={handleSell}
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
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <ExpensesTable />
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
