"use client";

import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { LootIcon } from "./icons/LootIconComponent";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useState } from "react";

export type LootItem = {
  name: string;
  price: number | string | null;
  icon: string;
};

export function PricesComponent({ items }: { items: LootItem[] }) {
  const [selectedItem, setSelectedItem] = useState<LootItem | null>(null);

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Название</TableHead>
            <TableHead>Цена</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item) => (
            <TableRow
              key={item.name}
              className="cursor-pointer hover:bg-muted"
              onClick={() => setSelectedItem(item)}
            >
              <TableCell>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <LootIcon itemName={item.name} />
                  </div>
                  <span>{item.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <span className="text-yellow-600 font-semibold">
                  {item.price}
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Очередь на {selectedItem?.name}</DialogTitle>
          </DialogHeader>

          {/* Заглушка, пока без API */}
          <div className="text-sm text-muted-foreground italic">
            Здесь появится очередь на этот предмет.
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
