import InventoryTab from "./InventoryTab";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function InventoryTabsClient({
  inventory,
  userId,
  onChange,
}: {
  inventory: any[];
  userId: number;
  onChange: () => void;
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
                <TabsTrigger key={type} value={type}>
                  {type}
                </TabsTrigger>
              )
            )}
          </TabsList>

          {["Техника", "Глайдеры", "Петы", "Куплено", "Выдано"].map((type) => (
            <TabsContent key={type} value={type}>
              <InventoryTab
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
