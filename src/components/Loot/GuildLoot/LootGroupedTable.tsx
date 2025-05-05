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
import { markLootItemAsSold } from "@/src/actions/markLootItemAsSold";
import { getActiveUsers } from "@/src/actions/getActiveUsers";
import { getLoot } from "@/src/actions/lootActions";

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
  const [maxQuantity, setMaxQuantity] = useState(1);
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
                      onClick={() => {
                        const itemToSell = loot.find(
                          (item) =>
                            item.itemTypeId === group.itemTypeId &&
                            item.status !== "Продано"
                        );
                        if (itemToSell) {
                          setSelectedItemId(itemToSell.id);
                          setDialogInitialPrice(
                            itemToSell.itemType?.price ?? 0
                          );
                          setMaxQuantity(itemToSell.quantity ?? 1);
                          setDialogOpen(true);
                        }
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
            console.log("📤 LootGroupedTable → markLootItemAsSold", {
              soldTo,
              price,
              quantity,
              isFree,
            });
            if (selectedItemId !== null) {
              await markLootItemAsSold({
                lootId: selectedItemId,
                soldTo,
                soldToId,
                price,
                comment,
                quantity,
                isFree,
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
