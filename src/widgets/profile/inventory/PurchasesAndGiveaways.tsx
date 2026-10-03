"use client";

import { useAsyncData } from "@/hooks/useAsyncData";
import InventoryLogTable from "./InventoryLogTable";
import UserExpensesTable from "./UserExpensesTable";
import LootQueueTable from "./LootQueueTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/ui";
import { getUserPurchaseLog } from "@/actions/getUserPurchaseLog";
import { getExpensesBySource } from "@/actions/expenseActions";
import { getUserLootQueue } from "@/actions/getUserLootQueue";

type Props = {
  userId: number;
  username?: string | null;
};

export default function PurchasesAndGiveaways({ userId, username }: Props) {
  const { data: loaded, isLoading } = useAsyncData(
    `${userId}:${username ?? ""}`,
    () => loadPurchases(userId, username),
  );
  const data = isLoading ? undefined : loaded;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Куплено / Выдано</CardTitle>
      </CardHeader>
      <CardContent>
        {!data && (
          <div className="flex h-24 items-center justify-center text-muted-foreground">
            Загрузка...
          </div>
        )}
        {data && (
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
              <InventoryLogTable
                dateLabel="Дата покупки"
                items={data.purchased}
              />
            </TabsContent>

            <TabsContent value="given">
              <InventoryLogTable dateLabel="Дата выдачи" items={data.given} />
            </TabsContent>

            <TabsContent value="expenses">
              <UserExpensesTable expenses={data.expenses} />
            </TabsContent>

            <TabsContent value="queue">
              <LootQueueTable items={data.queue} />
            </TabsContent>
          </Tabs>
        )}
      </CardContent>
    </Card>
  );
}

async function loadPurchases(userId: number, username?: string | null) {
  const [log, expenses, queue] = await Promise.all([
    getUserPurchaseLog(userId),
    username ? getExpensesBySource(username) : [],
    getUserLootQueue(userId),
  ]);
  return {
    purchased: log.filter((item) => item.type === "Куплено"),
    given: log.filter((item) => item.type === "Выдано"),
    expenses,
    queue,
  };
}
