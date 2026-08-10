import InventoryCategoryGrid from "./InventoryCategoryGrid";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";

const categories = ["Техника", "Глайдеры", "Петы"];

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
    <Card className="gap-3 py-4">
      <CardHeader>
        <CardTitle>Инвентарь игрока</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {categories.map((type) => (
          <div
            key={type}
            className="space-y-2 border-t pt-4 first:border-t-0 first:pt-0"
          >
            <h3 className="text-sm font-semibold text-muted-foreground">
              {type}
            </h3>
            <InventoryCategoryGrid
              canEdit={canEdit}
              type={type}
              inventory={inventory}
              userId={userId}
              onChange={onChange}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
