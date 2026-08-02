import InventoryLogTable from "./InventoryLogTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";

export default function PurchasesAndGiveaways({
  inventory,
}: {
  inventory: any[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Куплено / Выдано</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground">
            Куплено
          </h3>
          <InventoryLogTable
            type="Куплено"
            dateLabel="Дата покупки"
            inventory={inventory}
          />
        </div>

        <div className="space-y-3 border-t pt-6">
          <h3 className="text-sm font-semibold text-muted-foreground">
            Выдано
          </h3>
          <InventoryLogTable
            type="Выдано"
            dateLabel="Дата выдачи"
            inventory={inventory}
          />
        </div>
      </CardContent>
    </Card>
  );
}
