"use client";

import { useEffect, useState } from "react";
import InventoryLogTable from "./InventoryLogTable";
import UserExpensesTable from "./UserExpensesTable";
import LootQueueTable from "./LootQueueTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/ui";
import {
  getUserPurchaseLog,
  type InventoryLogEntry,
} from "@/actions/getUserPurchaseLog";
import { getExpensesBySource } from "@/actions/expenseActions";
import type { ExpenseItem } from "@/widgets/Loot/GuildLoot/ExpensesTypes";
import {
  getUserLootQueue,
  type UserLootQueueEntry,
} from "@/actions/getUserLootQueue";

export default function PurchasesAndGiveaways({
  userId,
  username,
}: {
  userId: number;
  username?: string | null;
}) {
  const [items, setItems] = useState<InventoryLogEntry[]>([]);
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [queue, setQueue] = useState<UserLootQueueEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      getUserPurchaseLog(userId),
      username ? getExpensesBySource(username) : Promise.resolve([]),
      getUserLootQueue(userId),
    ])
      .then(([log, exp, lootQueue]) => {
        setItems(log);
        setExpenses(exp);
        setQueue(lootQueue);
      })
      .finally(() => setLoading(false));
  }, [userId, username]);

  const purchased = items.filter((item) => item.type === "Куплено");
  const given = items.filter((item) => item.type === "Выдано");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Куплено / Выдано</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-24 text-muted-foreground">
            Загрузка...
          </div>
        ) : (
          <Tabs defaultValue="purchased">
            <TabsList className="mb-4">
              <TabsTrigger className="cursor-pointer" value="purchased">
                Куплено
              </TabsTrigger>
              <TabsTrigger className="cursor-pointer" value="given">
                Выдано
              </TabsTrigger>
              <TabsTrigger className="cursor-pointer" value="expenses">
                Расходы
              </TabsTrigger>
              <TabsTrigger className="cursor-pointer" value="queue">
                Очередь
              </TabsTrigger>
            </TabsList>

            <TabsContent value="purchased">
              <InventoryLogTable dateLabel="Дата покупки" items={purchased} />
            </TabsContent>

            <TabsContent value="given">
              <InventoryLogTable dateLabel="Дата выдачи" items={given} />
            </TabsContent>

            <TabsContent value="expenses">
              <UserExpensesTable expenses={expenses} />
            </TabsContent>

            <TabsContent value="queue">
              <LootQueueTable items={queue} />
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}
