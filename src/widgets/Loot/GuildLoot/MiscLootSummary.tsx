// components/MiscLootSummary.tsx
"use client";
import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { MISC_LOOT_ITEM_NAMES } from "./LootTypes";
import { LootIcon } from "../LootBuy/icons/LootIconComponent";
import { getMiscLootTotals, setMiscLootTotal } from "@/actions/miscLootTotals";
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui";

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
  const [addingFor, setAddingFor] = useState<string | null>(null);
  const [addValue, setAddValue] = useState("");

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

  const startAdding = (name: string) => {
    setAddingFor(name);
    setAddValue("");
  };

  const confirmAdd = (name: string) => {
    const delta = Number(addValue) || 0;
    setAddingFor(null);
    setAddValue("");
    if (!delta) return;
    setTotals((prev) =>
      prev.map((t) => {
        if (t.name !== name) return t;
        const amount = t.amount + delta;
        handleSave(name, amount);
        return { ...t, amount };
      }),
    );
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
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    className="h-7 w-24"
                    value={stat.amount}
                    onChange={(e) => handleChange(stat.name, e.target.value)}
                    onBlur={(e) =>
                      handleSave(stat.name, Number(e.target.value) || 0)
                    }
                  />
                  <Popover
                    open={addingFor === stat.name}
                    onOpenChange={(open) => {
                      if (open) startAdding(stat.name);
                      else {
                        setAddingFor(null);
                        setAddValue("");
                      }
                    }}
                  >
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7"
                      >
                        <Plus className="size-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-40 p-2" align="start">
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          autoFocus
                          placeholder="+100"
                          className="h-8"
                          value={addValue}
                          onChange={(e) => setAddValue(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") confirmAdd(stat.name);
                          }}
                        />
                        <Button
                          type="button"
                          size="sm"
                          className="h-8"
                          onClick={() => confirmAdd(stat.name)}
                        >
                          OK
                        </Button>
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
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
