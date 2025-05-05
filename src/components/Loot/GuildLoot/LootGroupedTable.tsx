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
import { SellLootDialog } from "./SellLootDialog";
import { useEffect, useState } from "react";
import { getActiveUsers } from "@/src/actions/getActiveUsers";
import { getLoot, getLootQuantity } from "@/src/actions/lootActions";
import { distributeLootItem } from "@/src/actions/distributeLootItems";

export function LootGroupedTable({
  groupedLoot,
  loot,
  setLoot,
}: {
  groupedLoot: GroupedLootItem[];
  loot: LootItem[];
  setLoot: (loot: LootItem[]) => void;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [dialogInitialPrice, setDialogInitialPrice] = useState<number>(0);
  const [maxQuantity, setMaxQuantity] = useState<number>(1);

  const [activeUsers, setActiveUsers] = useState<
    { id: number; username: string }[]
  >([]);

  useEffect(() => {
    const loadUsers = async () => {
      const users = await getActiveUsers();
      setActiveUsers(users);
    };
    loadUsers();
  }, []);

  const handleSellClick = async (group: GroupedLootItem) => {
    const itemToSell = loot.find((item) => item.group_id === group.id);

    if (itemToSell) {
      setSelectedItemId(itemToSell.id);
      setDialogInitialPrice(itemToSell.itemType?.price ?? 0);

      const quantityFromDb = await getLootQuantity(itemToSell.id);
      setMaxQuantity(quantityFromDb || 1);

      setDialogOpen(true);
    }
  };

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
              <TableRow key={group.id}>
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
                <TableCell>{Array.from(group.sold_to)[0]}</TableCell>
                <TableCell>
                  {Array.from(group.comments).join(" | ") || "—"}
                </TableCell>
                <TableCell>
                  {(group.status === "В наличии" ||
                    group.status === "Продаётся") && (
                    <Button
                      className="cursor-pointer"
                      variant="outline"
                      onClick={() => handleSellClick(group)}
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
      {selectedItemId !== null && (
        <SellLootDialog
          open={dialogOpen}
          maxQuantity={maxQuantity}
          onClose={() => setDialogOpen(false)}
          users={activeUsers.map(({ id, username }) => ({ id, username }))}
          initialPrice={dialogInitialPrice}
          onConfirm={async ({
            soldTo,
            soldToId,
            price,
            comment,
            quantity,
            isFree,
          }) => {
            if (selectedItemId !== null) {
              await distributeLootItem({
                lootId: selectedItemId,
                soldTo,
                soldToId,
                quantity,
                isFree: !!isFree,
                comment,
                price: isFree ? 0 : price,
              });
              const updatedLoot = await getLoot();
              setLoot(updatedLoot);
              setSelectedItemId(null);
            }
          }}
        />
      )}
    </div>
  );
}
