"use client";

import { ItemTypeTable } from "./ItemTypeTable";
import { MarketplaceItemTypeTable } from "./MarketplaceItemTypeTable";
import { Card } from "@/shared/ui";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/shared/ui";

export function ItemsPageContainer() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Предметы</h1>
      <Tabs defaultValue="treasury">
        <TabsList>
          <TabsTrigger value="treasury">Казна и лут</TabsTrigger>
          <TabsTrigger value="marketplace">Доска объявлений</TabsTrigger>
        </TabsList>
        <TabsContent value="treasury">
          <Card className="p-4">
            <ItemTypeTable />
          </Card>
        </TabsContent>
        <TabsContent value="marketplace">
          <Card className="p-4">
            <MarketplaceItemTypeTable />
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
