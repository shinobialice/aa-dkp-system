// components/LootTable.tsx
"use client";
import { useState, useEffect } from "react";
import { AddLootDialog } from "./AddLootDialog";

import { LootItem, ItemType, NewLootItem } from "./LootTypes";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
  Label,
} from "@/shared/ui";
import { getLoot, addLootItem, getItemTypes } from "@/actions/lootActions";
import { deleteLootItem } from "@/actions/deleteLootItem";
import { LootRawTable } from "./LootRawTable";
import { Button } from "@/shared/ui";
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
          {isAdmin && (
            <Button
              onClick={() => setShowDialog(true)}
              className="bg-primary cursor-pointer px-4 py-2 rounded"
            >
              Добавить доход
            </Button>
          )}
          <div className="flex gap-4 items-center mb-2">
            <Label>Месяц:</Label>
            <Select
              value={selectedMonth.toString()}
              onValueChange={(value) => setSelectedMonth(Number(value))}
            >
              <SelectTrigger className="ml-2 border rounded px-2 py-1 w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[...Array(12)].map((_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    {new Date(2000, i).toLocaleString("ru-RU", {
                      month: "long",
                    })}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Label>Год: </Label>
            <Select
              value={selectedYear.toString()}
              onValueChange={(value) => setSelectedYear(Number(value))}
            >
              <SelectTrigger className="ml-2 border rounded px-2 py-1 w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 6 }, (_, i) => now.getFullYear() - i).map(
                  (year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>
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
