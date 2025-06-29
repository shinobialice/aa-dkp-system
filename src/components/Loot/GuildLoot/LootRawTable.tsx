// components/LootRawTable.tsx
"use client";
import { useEffect, useState } from "react";
import { LootItem } from "./LootTypes";
import { LootIcon } from "../LootBuy/icons/LootIconComponent";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SellLootDialog } from "./SellLootDialog";
import { getActiveUsers } from "@/src/actions/getActiveUsers";
import { distributeLootItem } from "@/src/actions/distributeLootItems";
import { getLoot } from "@/src/actions/lootActions";

export function LootRawTable({
  loot,
  onDelete,
  onSell,
  isAdmin,
}: {
  loot: LootItem[];
  onDelete: (loot: LootItem) => void;
  onSell: (loot: LootItem) => void;
  isAdmin: boolean;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<LootItem | null>(null);
  const [activeUsers, setActiveUsers] = useState<
    { id: number; username: string }[]
  >([]);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    getActiveUsers().then(setActiveUsers);
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
              <TableHead>Продано</TableHead>
              <TableHead>Кому</TableHead>
              <TableHead>Комментарий</TableHead>
              {isAdmin && <TableHead>Действия</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loot.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  {!item.sold_to && item.acquired_at
                    ? new Intl.DateTimeFormat("ru-RU").format(
                        new Date(item.acquired_at)
                      )
                    : "—"}
                </TableCell>
                <TableCell>{item.source ?? "—"}</TableCell>
                <TableCell className="flex items-center gap-2">
                  <LootIcon itemName={item.itemType.name} size={30} />
                  <span>{item.itemType.name}</span>
                </TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>
                  {item.price ?? item.itemType?.price ?? "—"}
                </TableCell>
                <TableCell>{item.status}</TableCell>
                <TableCell>
                  {item.sold_at
                    ? new Intl.DateTimeFormat("ru-RU").format(
                        new Date(item.sold_at)
                      )
                    : "—"}
                </TableCell>
                <TableCell>{item.sold_to ?? "—"}</TableCell>
                <TableCell>{item.comment ?? "—"}</TableCell>
                {isAdmin && (
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        className={`cursor-pointer ${
                          item.sold_to
                            ? ""
                            : "bg-yellow-500 hover:bg-yellow-600 w-[100px]"
                        }`}
                        onClick={() => {
                          setSelectedItem(item);
                          setEditMode(!!item.sold_to);
                          setDialogOpen(true);
                        }}
                      >
                        {item.sold_to ? "Изменить" : "Продать"}
                      </Button>
                      <Button
                        className="cursor-pointer"
                        onClick={() => onDelete(item)}
                        variant="destructive"
                      >
                        Удалить
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>

      {selectedItem && (
        <SellLootDialog
          open={dialogOpen}
          onClose={() => {
            setDialogOpen(false);
            setSelectedItem(null);
          }}
          itemName={selectedItem.itemType.name}
          initialPrice={selectedItem.price ?? selectedItem.itemType?.price ?? 0}
          maxQuantity={selectedItem.quantity}
          users={activeUsers}
          editMode={editMode}
          initialValues={
            editMode
              ? {
                  soldTo: selectedItem.sold_to ?? "",
                  soldToId: selectedItem.sold_to_user_id,
                  quantity: selectedItem.quantity,
                  price:
                    selectedItem.price ?? selectedItem.itemType?.price ?? 0,
                  comment: selectedItem.comment ?? "",
                }
              : undefined
          }
          onConfirm={async (data) => {
            try {
              await distributeLootItem({
                lootId: selectedItem.id,
                quantity: data.quantity,
                soldTo: data.soldTo,
                soldToId: data.soldToId,
                isFree: data.isFree ?? false,
                comment: data.comment,
                price: data.price,
              });
              const updated = await getLoot();
              setSelectedItem(null);
              setDialogOpen(false);
              location.reload();
            } catch (err: any) {
              alert(err.message ?? "Ошибка при продаже");
            }
          }}
        />
      )}
    </div>
  );
}
