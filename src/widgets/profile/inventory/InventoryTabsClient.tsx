import InventoryTab from "./InventoryTab";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shared/ui";

export default function InventoryTabsClient({
  inventory,
  userId,
  onChange,
  canEdit,
}: {
  inventory: any[];
  userId: number;
  onChange: () => void;
  canEdit: boolean;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Инвентарь игрока</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="Техника">
          <TabsList className="mb-4">
            {["Техника", "Глайдеры", "Петы", "Куплено", "Выдано"].map(
              (type) => (
                <TabsTrigger className="cursor-pointer" key={type} value={type}>
                  {type}
                </TabsTrigger>
              ),
            )}
          </TabsList>

          {["Техника", "Глайдеры", "Петы", "Куплено", "Выдано"].map((type) => (
            <TabsContent key={type} value={type}>
              <InventoryTab
                canEdit={canEdit}
                type={type}
                inventory={inventory}
                userId={userId}
                onChange={onChange}
              />
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
