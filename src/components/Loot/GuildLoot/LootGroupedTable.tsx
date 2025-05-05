import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { GroupedLootItem, LootItem } from "./LootTypes";

export function LootGroupedTable({
  groupedLoot,
  loot,
  onSell,
}: {
  groupedLoot: GroupedLootItem[];
  loot: LootItem[];
  onSell: (id: number) => Promise<void>;
}) {
  return (
    <div className="overflow-auto rounded-md border">
      <ScrollArea className="h-[1000px] w-full">
        <Table>
          <TableHeader className="sticky top-0 z-1 bg-background">
            <TableRow>
              <TableHead>Получено</TableHead>
              <TableHead>Источник</TableHead>
              <TableHead>Предмет</TableHead>
              <TableHead>Кол-во</TableHead>
              <TableHead>Цена</TableHead>
              <TableHead>Статус</TableHead>
              <TableHead>Дата продажи</TableHead>
              <TableHead>Продано</TableHead>
              <TableHead>Кому</TableHead>
              <TableHead>Комментарий</TableHead>
              <TableHead>Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groupedLoot.map((group) => (
              <TableRow key={`${group.itemTypeId}-${group.status}`}>
                <TableCell>
                  {group.acquired_at
                    ? new Intl.DateTimeFormat("ru-RU").format(
                        new Date(group.acquired_at)
                      )
                    : "—"}
                </TableCell>
                <TableCell>{group.source ?? "—"}</TableCell>
                <TableCell>{group.name}</TableCell>
                <TableCell>{group.total}</TableCell>
                <TableCell>{group.price ?? "—"}</TableCell>
                <TableCell>{group.status}</TableCell>
                <TableCell>
                  {group.latest_sold_at
                    ? new Intl.DateTimeFormat("ru-RU").format(
                        new Date(group.latest_sold_at)
                      )
                    : "—"}
                </TableCell>
                <TableCell>{group.sold}</TableCell>
                <TableCell>
                  {Array.from(group.sold_to).join(", ") || "—"}
                </TableCell>
                <TableCell>
                  {Array.from(group.comments).join(" | ") || "—"}
                </TableCell>
                <TableCell>
                  {(group.status === "В наличии" ||
                    group.status === "Продаётся") && (
                    <Button
                    className="cursor-pointer"
                      variant="outline"
                      onClick={async () => {
                        const itemToSell = loot.find(
                          (item) =>
                            item.itemTypeId === group.itemTypeId &&
                            item.status !== "Продано"
                        );
                        if (itemToSell) await onSell(itemToSell.id);
                      }}
                    >
                      Продать
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    </div>
  );
}
