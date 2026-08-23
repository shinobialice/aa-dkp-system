"use client";

import { ItemTypeTable } from "./ItemTypeTable";
import { Card } from "@/shared/ui";

export function ItemsPageContainer() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Предметы казны и лута</h1>
      <Card className="p-4">
        <ItemTypeTable />
      </Card>
    </div>
  );
}
