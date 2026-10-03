"use client";

import { usePagination } from "@/hooks/usePagination";
import TablePager from "./TablePager";
import { LootIcon } from "@/widgets/Loot/LootBuy/icons/LootIconComponent";
import type { InventoryLogEntry } from "@/actions/getUserPurchaseLog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui";

const PAGE_SIZE = 10;

export default function InventoryLogTable({
  dateLabel,
  items,
}: {
  dateLabel: string;
  items: InventoryLogEntry[];
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
            <TableHead className="w-[35%]">Название</TableHead>
            <TableHead className="w-[20%]">{dateLabel}</TableHead>
            <TableHead className="w-[15%]">Количество</TableHead>
            <TableHead className="w-[30%]">Комментарий</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pageItems.map((item) => {
            return (
              <TableRow key={item.id}>
                <TableCell className="whitespace-normal break-words">
                  <div className="flex items-center gap-2">
                    <LootIcon
                      itemName={item.name}
                      iconUrl={item.iconUrl}
                      grade={item.grade}
                      size={28}
                    />
                    {item.name}
                  </div>
                </TableCell>
                <TableCell>
                  {item.date
                    ? new Date(item.date).toLocaleDateString("ru-RU")
                    : "—"}
                </TableCell>
                <TableCell>{item.quantity ?? 1}</TableCell>
                <TableCell className="whitespace-normal break-words">
                  {item.comment || "—"}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      <TablePager page={page} pageCount={pageCount} onPageChange={setPage} />
    </div>
  );
}
