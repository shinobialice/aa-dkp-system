"use client";

import { useEffect, useState } from "react";
import { LootIcon } from "@/widgets/Loot/LootBuy/icons/LootIconComponent";
import type { InventoryLogEntry } from "@/actions/getUserPurchaseLog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Button,
} from "@/shared/ui";

const PAGE_SIZE = 10;

export default function InventoryLogTable({
  dateLabel,
  items,
}: {
  dateLabel: string;
  items: InventoryLogEntry[];
}) {
  const [page, setPage] = useState(0);

  useEffect(() => {
    setPage(0);
  }, [items]);

  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">Пусто</p>;
  }

  const pageCount = Math.ceil(items.length / PAGE_SIZE);
  const pageItems = items.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <div className="space-y-2">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Название</TableHead>
            <TableHead>{dateLabel}</TableHead>
            <TableHead>Количество</TableHead>
            <TableHead>Источник</TableHead>
            <TableHead>Комментарий</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pageItems.map((item) => {
            return (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <LootIcon itemName={item.name} size={28} />
                    {item.name}
                  </div>
                </TableCell>
                <TableCell>
                  {item.date
                    ? new Date(item.date).toLocaleDateString("ru-RU")
                    : "—"}
                </TableCell>
                <TableCell>{item.quantity ?? 1}</TableCell>
                <TableCell>{item.source}</TableCell>
                <TableCell>{item.comment || "—"}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {pageCount > 1 && (
        <div className="flex items-center justify-between pt-1">
          <span className="text-xs text-muted-foreground">
            Страница {page + 1} из {pageCount}
          </span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer"
              disabled={page === 0}
              onClick={() => setPage((p) => p - 1)}
            >
              Назад
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer"
              disabled={page >= pageCount - 1}
              onClick={() => setPage((p) => p + 1)}
            >
              Далее
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
