import { LootIcon } from "./icons/LootIconComponent";
import { LootQueuePopover } from "./LootQueuePopover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type LootItem = {
  name: string;
  price: number | string | null;
  icon: string;
};

export function PricesComponent({ items }: { items: LootItem[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Название</TableHead>
          <TableHead>Цена</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.map((item) => (
          <LootQueuePopover key={item.name} itemName={item.name}>
            <TableRow className="hover:bg-muted cursor-pointer">
              <TableCell>
                <div className="flex items-center gap-2">
                  <LootIcon itemName={item.name} />
                  <span>{item.name}</span>
                </div>
              </TableCell>
              <TableCell className="text-yellow-600 font-semibold">
                {item.price}
              </TableCell>
            </TableRow>
          </LootQueuePopover>
        ))}
      </TableBody>
    </Table>
  );
}
