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
import { deleteLootItem } from "@/src/actions/deleteLootItem";
import { Pen, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { LootIcon } from "../LootBuy/icons/LootIconComponent";

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
  const [lootToDelete, setLootToDelete] = useState<LootItem | null>(null);
  const [selectedItemName, setSelectedItemName] = useState<
    string | undefined
  >();

  const [initialModeValues, setInitialModeValues] = useState<{
    soldTo?: string;
    soldToId?: number;
    quantity?: number;
    price?: number;
    comment?: string;
  }>();

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
    const itemToSell = loot.find(
      (item) =>
        item.itemTypeId === group.itemTypeId &&
        item.status === group.status &&
        item.status !== "Продано" &&
        item.status !== "Выдано"
    );
    if (itemToSell) {
      setSelectedItemId(itemToSell.id);
      setSelectedItemName(group.name);
      setDialogInitialPrice(itemToSell.itemType?.price ?? 0);
      const quantityFromDb = await getLootQuantity(itemToSell.id);
      setMaxQuantity(quantityFromDb || 1);
      setInitialModeValues(undefined);
      setDialogOpen(true);
    }
  };

  const handleEdit = (group: GroupedLootItem) => {
    const itemToEdit = loot.find(
      (item) =>
        item.itemTypeId === group.itemTypeId &&
        item.status === group.status &&
        (item.status === "Продано" || item.status === "Выдано")
    );

    if (itemToEdit) {
      setSelectedItemId(itemToEdit.id);
      setSelectedItemName(group.name);
      setDialogInitialPrice(itemToEdit.price ?? 0);
      setMaxQuantity(itemToEdit.quantity ?? 1);
      setInitialModeValues({
        soldTo: itemToEdit.sold_to ?? undefined,
        soldToId: itemToEdit.sold_to_user_id ?? undefined,
        quantity: itemToEdit.quantity ?? 1,
        price: itemToEdit.price ?? undefined,
        comment: itemToEdit.comment ?? "",
      });
      setDialogOpen(true);
    }
  };

  const handleDeleteClick = (group: GroupedLootItem) => {
    const itemToDelete = loot.find(
      (item) =>
        item.itemTypeId === group.itemTypeId &&
        item.status === group.status &&
        (item.status === "Продано" || item.status === "Выдано")
    );

    if (itemToDelete) {
      setLootToDelete(itemToDelete);
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
                <TableCell className="flex items-center gap-2">
                  <LootIcon itemName={group.name} size={30} />
                  <span>{group.name}</span>
                </TableCell>
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
                  {(group.status === "Продано" ||
                    group.status === "Выдано") && (
                    <div className="flex gap-2">
                      <Button
                        className="cursor-pointer"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(group)}
                      >
                        <Pen className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        className="cursor-pointer"
                        size="icon"
                        onClick={() => handleDeleteClick(group)}
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  )}
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
          editMode={!!initialModeValues}
          itemName={selectedItemName}
          onClose={() => setDialogOpen(false)}
          users={activeUsers.map(({ id, username }) => ({ id, username }))}
          initialPrice={dialogInitialPrice}
          initialValues={initialModeValues}
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
              setInitialModeValues(undefined);
            }
          }}
        />
      )}

      <AlertDialog
        open={!!lootToDelete}
        onOpenChange={(open) => !open && setLootToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить предмет?</AlertDialogTitle>
          </AlertDialogHeader>
          <div>
            Вы уверены, что хотите удалить <b>{lootToDelete?.itemType.name}</b>?
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="cursor-pointer"
              onClick={() => setLootToDelete(null)}
            >
              Отмена
            </AlertDialogCancel>
            <AlertDialogAction
              className="cursor-pointer"
              onClick={async () => {
                if (lootToDelete) {
                  await deleteLootItem(lootToDelete.id);
                  const updated = await getLoot();
                  setLoot(updated);
                  setLootToDelete(null);
                }
              }}
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
