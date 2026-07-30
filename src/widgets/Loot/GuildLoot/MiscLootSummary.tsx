// components/MiscLootSummary.tsx
"use client";
import { useEffect, useState } from "react";
import { MISC_LOOT_ITEM_NAMES } from "./LootTypes";
import { LootIcon } from "../LootBuy/icons/LootIconComponent";
import { getMiscLootTotals, setMiscLootTotal } from "@/actions/miscLootTotals";
import { Card, CardContent, CardHeader, CardTitle, Input } from "@/shared/ui";

export function MiscLootSummary({
  selectedMonth,
  selectedYear,
  isAdmin,
}: {
  selectedMonth: number;
  selectedYear: number;
  isAdmin: boolean;
}) {
  const [totals, setTotals] = useState<{ name: string; amount: number }[]>(
    MISC_LOOT_ITEM_NAMES.map((name) => ({ name, amount: 0 })),
  );

  useEffect(() => {
    getMiscLootTotals(selectedMonth, selectedYear).then(setTotals);
  }, [selectedMonth, selectedYear]);

  const handleChange = (name: string, value: string) => {
    const amount = Number(value) || 0;
    setTotals((prev) =>
      prev.map((t) => (t.name === name ? { ...t, amount } : t)),
    );
  };

  const handleSave = (name: string, amount: number) => {
    setMiscLootTotal({ name, month: selectedMonth, year: selectedYear, amount });
  };

  return (
    <Card className="py-4 gap-2">
      <CardHeader className="px-4">
        <CardTitle className="text-sm text-muted-foreground font-normal">
          Разное
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 flex flex-wrap gap-6">
        {totals.map((stat) => (
          <div key={stat.name} className="flex items-center gap-2">
            <LootIcon itemName={stat.name} size={28} />
            <div className="text-sm">
              <div>{stat.name}</div>
              {isAdmin ? (
                <Input
                  type="number"
                  className="h-7 w-28"
                  value={stat.amount}
                  onChange={(e) => handleChange(stat.name, e.target.value)}
                  onBlur={(e) => handleSave(stat.name, Number(e.target.value) || 0)}
                />
              ) : (
                <div className="text-muted-foreground">
                  {stat.amount.toLocaleString("ru-RU")}
                </div>
              )}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
