// components/LootRawTable.tsx
"use client";
import { useEffect, useMemo, useState } from "react";
import { ArrowUpDown } from "lucide-react";
import { LootItem, MISC_LOOT_ITEM_NAMES } from "./LootTypes";
import { LootIcon } from "../LootBuy/icons/LootIconComponent";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui";
import { Button } from "@/shared/ui";
import { ScrollArea } from "@/shared/ui";
import { SellLootDialog } from "./SellLootDialog";
import { getActiveUsers } from "@/actions/getActiveUsers";
import {
  distributeLootItem,
  updateLootSale,
} from "@/actions/distributeLootItems";
import { getLoot } from "@/actions/lootActions";

export function isSameMonth(date: Date, month: number, year: number) {
  return date.getMonth() + 1 === month && date.getFullYear() === year;
}

function isOnOrBeforeMonth(date: Date, month: number, year: number) {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  return y < year || (y === year && m <= month);
}

export function LootRawTable({
  loot,
  onDelete,
  onSell,
  isAdmin,
  selectedMonth,
  selectedYear,
}: {
  loot: LootItem[];
  onDelete: (loot: LootItem) => void;
  onSell: (loot: LootItem) => void;
  isAdmin: boolean;
  selectedMonth: number;
  selectedYear: number;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<LootItem | null>(null);
  const [activeUsers, setActiveUsers] = useState<
    { id: number; username: string }[]
  >([]);
  const [editMode, setEditMode] = useState(false);
  const [sortKey, setSortKey] = useState<
    "acquired_at" | "sold_at" | "status" | null
  >(null);
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    getActiveUsers().then(setActiveUsers);
  }, []);

  const toggleSort = (key: "acquired_at" | "sold_at" | "status") => {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sortHeader = (label: string, key: "acquired_at" | "sold_at" | "status") => (
    <Button
      variant="ghost"
      className="cursor-pointer -ml-3 h-auto px-3 py-1"
      onClick={() => toggleSort(key)}
    >
      {label}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  );

  const visibleLoot = useMemo(() => {
    const filtered = loot.filter((item) => {
      if (MISC_LOOT_ITEM_NAMES.includes(item.itemType.name)) return false;
      if (item.status === "Распродано") return false;

      const acquired = item.acquired_at ? new Date(item.acquired_at) : null;
      const acquiredThisMonth = acquired
        ? isSameMonth(acquired, selectedMonth, selectedYear)
        : false;

      if (item.status === "В наличии") {
        // Ещё не продано — переносим из прошлых месяцев, пока не продастся
        return acquired
          ? isOnOrBeforeMonth(acquired, selectedMonth, selectedYear)
          : false;
      }

      if (item.status === "В казну" || item.status === "Продано") {
        const sold = item.sold_at ? new Date(item.sold_at) : null;
        const soldThisMonth = sold
          ? isSameMonth(sold, selectedMonth, selectedYear)
          : false;
        // Показываем, если получено в этом месяце или продано в этом месяце
        return acquiredThisMonth || soldThisMonth;
      }

      return false;
    });

    if (!sortKey) return filtered;

    return [...filtered].sort((a, b) => {
      if (sortKey === "status") {
        const cmp = (a.status ?? "").localeCompare(b.status ?? "");
        return sortDir === "asc" ? cmp : -cmp;
      }
      const aTime = a[sortKey] ? new Date(a[sortKey] as Date).getTime() : 0;
      const bTime = b[sortKey] ? new Date(b[sortKey] as Date).getTime() : 0;
      return sortDir === "asc" ? aTime - bTime : bTime - aTime;
    });
  }, [loot, selectedMonth, selectedYear, sortKey, sortDir]);

  return (
    <div className="overflow-auto rounded-md border">
      <ScrollArea className="h-[1000px] w-full">
        <Table>
          <TableHeader className="sticky top-0 z-1 bg-background">
            <TableRow>
              <TableHead>{sortHeader("Получено", "acquired_at")}</TableHead>
              <TableHead>Источник</TableHead>
              <TableHead>Предмет</TableHead>
              <TableHead>Кол-во</TableHead>
              <TableHead>Цена</TableHead>
              <TableHead>{sortHeader("Статус", "status")}</TableHead>
              <TableHead>{sortHeader("Продано", "sold_at")}</TableHead>
              <TableHead>Кому</TableHead>
              <TableHead>Комментарий</TableHead>
              {isAdmin && <TableHead>Действия</TableHead>}
            </TableRow>
          </TableHeader>
          <TableBody>
            {visibleLoot.map((item) => (
                <TableRow key={item.id}>
                <TableCell>
                  {item.acquired_at
                    ? new Intl.DateTimeFormat("ru-RU").format(
                        new Date(item.acquired_at),
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
                        new Date(item.sold_at),
                      )
                    : "—"}
                </TableCell>
                <TableCell>{item.sold_to ?? "—"}</TableCell>
                <TableCell>{item.comment ?? "—"}</TableCell>
                {isAdmin && (
                  <TableCell>
                    <div className="flex gap-2">
                        {item.status !== "В казну" && (
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
                        )}
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
                  soldToId: selectedItem.sold_to_user_id || undefined,
                  quantity: selectedItem.quantity,
                  price:
                    selectedItem.price ?? selectedItem.itemType?.price ?? 0,
                  comment: selectedItem.comment ?? "",
                }
              : undefined
          }
          onConfirm={async (data) => {
            try {
              const action = editMode ? updateLootSale : distributeLootItem;
              await action({
                lootId: selectedItem.id,
                quantity: data.quantity,
                soldTo: data.soldTo,
                soldToId: data.soldToId,
                isFree: data.isFree ?? false,
                comment: data.comment,
                price: data.price,
              });
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
