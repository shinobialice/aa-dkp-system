"use client";

import { useEffect, useState } from "react";
import { LootIcon } from "@/widgets/Loot/LootBuy/icons/LootIconComponent";
import { StatusBadge } from "@/widgets/Loot/LootBuy/LootQueuePopover/StatusBadge";
import type { UserLootQueueEntry } from "@/actions/getUserLootQueue";
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

export default function LootQueueTable({
  items,
}: {
  items: UserLootQueueEntry[];
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
      <Table className="table-fixed">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[40%]">Название</TableHead>
            <TableHead className="w-[30%]">Место в очереди</TableHead>
            <TableHead className="w-[30%]">Статус</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pageItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell className="whitespace-normal break-words">
                <div className="flex items-center gap-2">
                  <LootIcon
                    itemName={item.itemName}
                    iconUrl={item.iconUrl}
                    grade={item.grade}
                    size={28}
                  />
                  {item.itemName}
                </div>
              </TableCell>
              <TableCell>
                {item.place} из {item.totalInQueue}
              </TableCell>
              <TableCell>
                {item.status && item.status !== "продано" && item.status !== "ожидание" ? (
                  <StatusBadge status={item.status} />
                ) : (
                  <span>{item.status || "—"}</span>
                )}
              </TableCell>
            </TableRow>
          ))}
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
