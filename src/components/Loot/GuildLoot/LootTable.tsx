"use client";

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

export default function LootTable() {
  const [loot, setLoot] = useState<LootItem[]>([]);
  const [itemTypes, setItemTypes] = useState<ItemType[]>([]);
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

  return (
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

      <AddLootDialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        onAdd={handleAdd}
        itemTypes={itemTypes}
      />
    </div>
  );
}
