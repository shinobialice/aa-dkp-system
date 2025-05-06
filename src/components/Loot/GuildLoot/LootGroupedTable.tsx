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
import { getLoot } from "@/src/actions/lootActions";
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
import { sellGroupedLootItems } from "@/src/actions/sellGroupedLootItems";
import { useUserTag } from "@/src/hooks/useUserTag";

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
  const [selectedGroup, setSelectedGroup] = useState<GroupedLootItem | null>(
    null
  );
  const isAdmin = useUserTag("Администратор");
  const isModerator = useUserTag("Модератор");
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
    setSelectedItemName(group.name);
    setDialogInitialPrice(group.price ?? 0);
    setMaxQuantity(group.total);
    setInitialModeValues(undefined);
    setSelectedGroup(group);
    setDialogOpen(true);
  };

  const handleEdit = async (group: GroupedLootItem) => {
    setSelectedItemName(group.name);
    setDialogInitialPrice(group.price ?? 0);
    setMaxQuantity(group.total);
    setInitialModeValues({
      soldTo: Array.from(group.sold_to)[0],
      quantity: group.total,
      price: group.price ?? undefined,
      comment: Array.from(group.comments).join(" | "),
      soldToId: undefined,
    });
    setSelectedGroup(group);
    setDialogOpen(true);
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
              {isAdmin && <TableHead>Действия</TableHead>}
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
                {isAdmin && (
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
                      </div>
                    )}
                    {(group.status === "В наличии" ||
                      group.status === "Продаётся") && (
                      <div className="flex gap-2">
                        {isAdmin && (
                          <Button
                            className="cursor-pointer"
                            variant="outline"
                            onClick={() => handleSellClick(group)}
                          >
                            Продать
                          </Button>
                        )}
                      </div>
                    )}
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>

      <SellLootDialog
        open={dialogOpen}
        maxQuantity={maxQuantity}
        editMode={!!initialModeValues}
        itemName={selectedItemName}
        onClose={() => {
          setDialogOpen(false);
          setSelectedGroup(null);
        }}
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
          if (!selectedGroup) return;

          // Удалить все проданные записи этой группы
          const groupItems = loot.filter(
            (item) =>
              item.itemTypeId === selectedGroup.itemTypeId &&
              item.status === selectedGroup.status &&
              (item.status === "Продано" || item.status === "Выдано")
          );

          for (const item of groupItems) {
            await deleteLootItem(item.id);
          }

          // Создать одну новую запись с нужным количеством
          await distributeLootItem({
            lootId: groupItems[0]?.id ?? 0, // любой id, он не используется
            soldTo,
            soldToId,
            quantity,
            isFree: !!isFree,
            comment,
            price,
          });

          const updatedLoot = await getLoot();
          setLoot(updatedLoot);
          setSelectedGroup(null);
          setInitialModeValues(undefined);
        }}
      />

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
