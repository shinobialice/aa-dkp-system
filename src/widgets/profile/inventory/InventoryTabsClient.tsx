"use client";

import InventoryCategories from "./InventoryCategories";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";

export default function InventoryTabsClient({
  inventory,
  userId,
}: {
  inventory: any[];
  userId: number;
}) {
  return (
    <Card className="gap-3 py-4">
      <CardHeader>
        <CardTitle>Инвентарь игрока</CardTitle>
      </CardHeader>
      <CardContent>
        <InventoryCategories
          canEdit={false}
          inventory={inventory}
          userId={userId}
          onChange={() => {}}
        />
      </CardContent>
    </Card>
  );
}
