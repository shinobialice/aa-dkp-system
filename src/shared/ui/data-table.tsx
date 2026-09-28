import { cn } from "@/shared/lib";
import {
  type ColumnDef,
  type OnChangeFn,
  type RowSelectionState,
  type SortingState,
  TableOptions,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ChevronUp } from "lucide-react";
import { Typography } from "./typography";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./table";
import { ScrollArea } from "./scroll-area";

interface DataTableProps<TData> {
  tableClassName?: string;
  columns: ColumnDef<TData, any>[];
  data: TData[];
  onSortingChange?: OnChangeFn<SortingState>;
  globalFilter?: unknown;
}

export const DataTable = <TData,>({
  columns,
  data,
  tableClassName,
  onSortingChange,
  globalFilter,
}: DataTableProps<TData>) => {
  const table = useReactTable({
    columns,
    data,
    onSortingChange: onSortingChange,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <ScrollArea className="w-full min-h-32 rounded-md border">
      <Table className={tableClassName}>
        <TableHeader className="sticky top-0 z-10 bg-background">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder ? null : (
                    <div
                      className={cn("flex items-center gap-2", {
                        "cursor-pointer": header.column.getCanSort(),
                      })}
                      onKeyDown={
                        header.column.getCanSort()
                          ? header.column.getToggleSortingHandler()
                          : undefined
                      }
                      onClick={
                        header.column.getCanSort()
                          ? header.column.getToggleSortingHandler()
                          : undefined
                      }
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      {header.column.getIsSorted() && (
                        <ChevronUp
                          className={cn("transition-transform", {
                            "rotate-180":
                              header.column.getIsSorted() === "desc",
                          })}
                          size={16}
                        />
                      )}
                    </div>
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                {!!globalFilter && (
                  <Typography variant="large" as="span">
                    Ничего не найдено
                  </Typography>
                )}
                {!globalFilter && (
                  <Typography variant="large" as="span">
                    Нет данных
                  </Typography>
                )}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </ScrollArea>
  );
};
