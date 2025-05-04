"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { sellLootItem, getLoot, addLootItem } from "@/src/actions/lootActions";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { LootIcon } from "./LootBuy/icons/LootIconComponent";
import { LootIcons } from "@/src/components/Loot/LootBuy/icons/LootIcons";
import { Label } from "@/components/ui/label";

export default function LootTable() {
  type LootItem = {
    id: number;
    status: string;
    source: string | null;
    created_at: Date;
    itemTypeId: number;
    sold_at: Date | null;
    sold_to: string | null;
    comment: string | null;
    acquired_at: Date | null;
    itemType: {
      id: number;
      name: string;
      price: number | null;
    };
  };

  const [loot, setLoot] = useState<LootItem[]>([]);
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [showDialog, setShowDialog] = useState(false);
  const [newItem, setNewItem] = useState({
    itemTypeId: 1,
    itemName: "",
    source: "",
    acquired_at: new Date().toISOString().split("T")[0],
    quantity: 1,
  });
  const [popoverOpen, setPopoverOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const data = await getLoot();
      setLoot(data);
    };
    loadData();
  }, []);

  const handleSell = async (id: number) => {
    await sellLootItem(id);
    const updated = await getLoot();
    setLoot(updated);
  };

  const filteredLoot = loot.filter((item) => {
    if (item.status === "В наличии" || item.status === "Продаётся") return true;
    if (!item.sold_at) return false;

    const soldDate = new Date(item.sold_at);
    return soldDate.getMonth() + 1 === month && soldDate.getFullYear() === year;
  });

  const groupedLoot = Object.values(
    filteredLoot.reduce((acc, item) => {
      const key = `${item.itemTypeId}-${item.status}`;
      if (!acc[key]) {
        acc[key] = {
          itemTypeId: item.itemTypeId,
          name: item.itemType.name,
          price: item.itemType.price,
          source: item.source,
          acquired_at: item.acquired_at,
          total: 0,
          sold: 0,
          latest_sold_at: null,
          sold_to: new Set<string>(),
          comments: new Set<string>(),
          status: item.status,
        };
      }

      acc[key].total += 1;
      if (item.status === "Продано") {
        acc[key].sold += 1;
        if (
          item.sold_at &&
          (!acc[key].latest_sold_at || item.sold_at > acc[key].latest_sold_at)
        ) {
          acc[key].latest_sold_at = item.sold_at;
        }
      }

      if (item.sold_to) acc[key].sold_to.add(item.sold_to);
      if (item.comment) acc[key].comments.add(item.comment);

      return acc;
    }, {} as Record<string, any>)
  );

  const allItemNames = Object.keys(LootIcons);

  const getItemTypeIdByName = (name: string): number => {
    const match = loot.find((l) => l.itemType.name === name);
    return match?.itemTypeId ?? 1;
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      <div className="col-span-2 space-y-4">
        <div className="flex gap-4 items-center">
          <select
            value={month}
            onChange={(e) => setMonth(parseInt(e.target.value))}
            className="border rounded px-2 py-1"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((m) => (
              <option key={m} value={m}>
                {new Date(0, m - 1).toLocaleString("default", {
                  month: "long",
                })}
              </option>
            ))}
          </select>

          <select
            value={year}
            onChange={(e) => setYear(parseInt(e.target.value))}
            className="border rounded px-2 py-1"
          >
            {[2024, 2025, 2026].map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          <Button onClick={() => setShowDialog(true)}>Добавить лут</Button>
        </div>

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
                </TableRow>
              </TableHeader>
              <TableBody>
                {groupedLoot.map((group) => (
                  <TableRow key={group.itemTypeId}>
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
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </div>
      </div>

      {showDialog && (
        <Dialog
          open={showDialog}
          onOpenChange={(open) => {
            setShowDialog(open);
            if (!open) setPopoverOpen(false); // сбрасываем поповер при закрытии диалога
          }}
        >
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Добавить лут</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-2 py-4">
              <Label>Предмет</Label>
              {newItem.itemName && (
                <div className="flex items-center gap-2 mb-2">
                  <LootIcon itemName={newItem.itemName} size={32} />
                  <span className="font-medium">{newItem.itemName}</span>
                </div>
              )}
              <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                  <input
                    ref={inputRef}
                    type="text"
                    placeholder="Поиск предмета..."
                    value={newItem.itemName}
                    onClick={() => setPopoverOpen(true)} // было onFocus
                    readOnly // это можно оставить, но лучше заменить на disabled + стили, или убрать
                    className="border rounded px-2 py-1 cursor-pointer"
                  />
                </PopoverTrigger>
                <PopoverContent className="p-0 w-[378px]">
                  <Command>
                    <CommandInput placeholder="Поиск..." />
                    <CommandList>
                      {allItemNames.map((name) => (
                        <CommandItem
                          key={name}
                          value={name}
                          onSelect={() => {
                            setNewItem((prev) => ({
                              ...prev,
                              itemTypeId: getItemTypeIdByName(name),
                              itemName: name,
                            }));
                            setPopoverOpen(false);
                            inputRef.current?.blur();
                          }}
                          className="flex items-center gap-2"
                        >
                          <LootIcon itemName={name} size={24} />
                          <span>{name}</span>
                        </CommandItem>
                      ))}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              <Label>Источник</Label>
              <input
                type="text"
                value={newItem.source}
                onChange={(e) =>
                  setNewItem({ ...newItem, source: e.target.value })
                }
                className="border rounded px-2 py-1"
              />
              <Label>Дата получения</Label>
              <input
                type="date"
                value={newItem.acquired_at}
                onChange={(e) =>
                  setNewItem({ ...newItem, acquired_at: e.target.value })
                }
                className="border rounded px-2 py-1"
              />
              <Label>Количество</Label>
              <input
                type="number"
                min={1}
                value={newItem.quantity}
                onChange={(e) =>
                  setNewItem({ ...newItem, quantity: parseInt(e.target.value) })
                }
                className="border rounded px-2 py-1"
              />
            </div>
            <DialogFooter>
              <Button variant="secondary" onClick={() => setShowDialog(false)}>
                Отмена
              </Button>
              <Button
                onClick={async () => {
                  await addLootItem({
                    itemTypeId: newItem.itemTypeId,
                    source: newItem.source,
                    acquired_at: newItem.acquired_at,
                    quantity: newItem.quantity,
                  });
                  setShowDialog(false);
                  const updated = await getLoot();
                  setLoot(updated);
                }}
              >
                Сохранить
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
