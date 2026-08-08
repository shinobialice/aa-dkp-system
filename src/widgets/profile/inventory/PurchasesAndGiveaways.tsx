"use client";

import { useEffect, useState } from "react";
import InventoryLogTable from "./InventoryLogTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";
import {
  getUserPurchaseLog,
  type InventoryLogEntry,
} from "@/actions/getUserPurchaseLog";

export default function PurchasesAndGiveaways({ userId }: { userId: number }) {
  const [items, setItems] = useState<InventoryLogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getUserPurchaseLog(userId)
      .then(setItems)
      .finally(() => setLoading(false));
  }, [userId]);

  const purchased = items.filter((item) => item.type === "Куплено");
  const given = items.filter((item) => item.type === "Выдано");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Куплено / Выдано</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {loading ? (
          <div className="flex items-center justify-center h-24 text-muted-foreground">
            Загрузка...
          </div>
        ) : (
          <>
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground">
                Куплено
              </h3>
              <InventoryLogTable dateLabel="Дата покупки" items={purchased} />
            </div>

            <div className="space-y-3 border-t pt-6">
              <h3 className="text-sm font-semibold text-muted-foreground">
                Выдано
              </h3>
              <InventoryLogTable dateLabel="Дата выдачи" items={given} />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
