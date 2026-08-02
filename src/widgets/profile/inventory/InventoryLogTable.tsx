import Image from "next/image";
import inventoryIcons from "./InventoryIcons";
import {
  LootIcons,
  getLootIconUrl,
} from "@/widgets/Loot/LootBuy/icons/LootIcons";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui";

function resolveIconUrl(name: string): string | null {
  if (inventoryIcons[name]) return inventoryIcons[name];
  if (LootIcons[name] !== undefined) return getLootIconUrl(name);
  return null;
}

export default function InventoryLogTable({
  type,
  dateLabel,
  inventory,
}: {
  type: string;
  dateLabel: string;
  inventory: any[];
}) {
  const items = inventory.filter((inv) => inv.type === type);

  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">Пусто</p>;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Название</TableHead>
          <TableHead>{dateLabel}</TableHead>
          <TableHead>Количество</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => {
          const iconUrl = resolveIconUrl(item.name);
          return (
            <TableRow key={item.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  {iconUrl && (
                    <Image
                      src={iconUrl}
                      alt=""
                      width={28}
                      height={28}
                      className="rounded"
                    />
                  )}
                  {item.name}
                </div>
              </TableCell>
              <TableCell>
                {new Date(item.created_at).toLocaleDateString("ru-RU")}
              </TableCell>
              <TableCell>{item.quantity ?? 1}</TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
