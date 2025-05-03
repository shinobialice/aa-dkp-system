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
          <TableRow key={item.name}>
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
  );
}
