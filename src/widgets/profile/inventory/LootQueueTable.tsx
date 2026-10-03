"use client";

import { usePagination } from "@/hooks/usePagination";
import TablePager from "./TablePager";
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
} from "@/shared/ui";

const PAGE_SIZE = 10;

export default function LootQueueTable({
  items,
}: {
  items: UserLootQueueEntry[];
}) {
  const { page, setPage, pageCount, pageItems } = usePagination(
    items,
    PAGE_SIZE,
  );

  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">Пусто</p>;
  }

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
                {item.status &&
                item.status !== "продано" &&
                item.status !== "ожидание" ? (
                  <StatusBadge status={item.status} />
                ) : (
                  <span>{item.status || "—"}</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <TablePager page={page} pageCount={pageCount} onPageChange={setPage} />
    </div>
  );
}
