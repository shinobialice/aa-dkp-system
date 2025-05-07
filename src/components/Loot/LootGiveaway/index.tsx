"use client";

import { useState, useMemo, startTransition } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
  ColumnFiltersState,
} from "@tanstack/react-table";
import type { Row } from "@tanstack/react-table";
import { format } from "date-fns";
import { lootColumns } from "./lootColumns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { saveGivenAwayLoot } from "@/src/actions/saveGivenAwayLoot";
import useUserTag from "@/src/hooks/useUserTag";

type LootItem = {
  name: string;
  date: string;
  comment?: string;
  status: string;
};

type Player = {
  id: number;
  username: string;
  active: boolean;
  loot: LootItem[];
};

export default function LootGiveaway({
  initialPlayers,
}: {
  initialPlayers: Player[];
}) {
  const [allPlayers, setAllPlayers] = useState<Player[]>(initialPlayers);
  const [editMode, setEditMode] = useState(false);
  const [showInactive, setShowInactive] = useState(false);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const isAdmin = useUserTag("Администратор");

  const displayedPlayers = useMemo(
    () => allPlayers.filter((p) => p.active || showInactive),
    [allPlayers, showInactive]
  );

  const updateLoot = (
    playerIndex: number,
    lootIndex: number,
    changes: Partial<LootItem>
  ) => {
    const updated = [...allPlayers];
    const loot = updated[playerIndex].loot[lootIndex];
    Object.assign(loot, changes);
    setAllPlayers(updated);

    const { name, date, comment, status } = loot;
    const isValidDate = date && !isNaN(Date.parse(date));
    if (
      !name.startsWith("Прочее") &&
      status &&
      (status === "Выдано" ? isValidDate : true)
    ) {
      startTransition(() => {
        saveGivenAwayLoot(updated[playerIndex].id, {
          name,
          date: isValidDate ? date : new Date().toISOString().split("T")[0],
          comment,
          status,
        });
      });
    }
  };

  const renderLootCell = (
    loot: LootItem,
    isEditMode: boolean,
    playerIndex: number,
    lootIndex: number
  ) => {
    const dateValid = loot.date && !isNaN(Date.parse(loot.date));

    if (!isEditMode) {
      if (loot.name.startsWith("Прочее")) {
        if (loot.comment && dateValid) {
          return `${loot.comment} (${format(
            new Date(loot.date),
            "dd.MM.yyyy"
          )})`;
        }
        if (loot.comment) {
          return loot.comment;
        }
        if (dateValid) {
          return format(new Date(loot.date), "dd.MM.yyyy");
        }
        return "–";
      }

      if (loot.status === "В наличии") {
        return "В наличии";
      }
      if (loot.status === "Выдано" && dateValid) {
        return `Выдано (${format(new Date(loot.date), "dd.MM.yyyy")})`;
      }
      return "–";
    }

    if (loot.name.startsWith("Прочее")) {
      return (
        <div className="flex flex-col gap-1">
          <Input
            placeholder="Название предмета"
            value={loot.comment || ""}
            onChange={(e) =>
              updateLoot(playerIndex, lootIndex, { comment: e.target.value })
            }
            className="text-xs"
          />
          <input
            type="date"
            className="text-xs border rounded px-2 py-1"
            value={loot.date || ""}
            onChange={(e) =>
              updateLoot(playerIndex, lootIndex, { date: e.target.value })
            }
          />
        </div>
      );
    }

    return (
      <div className="flex flex-col gap-1">
        <select
          className="text-xs border rounded px-2 py-1"
          value={loot.status || ""}
          onChange={(e) =>
            updateLoot(playerIndex, lootIndex, { status: e.target.value })
          }
        >
          <option value="">–</option>
          <option value="Выдано">Выдано</option>
          <option value="В наличии">В наличии</option>
        </select>

        {loot.status === "Выдано" && (
          <input
            type="date"
            className="text-xs border rounded px-2 py-1"
            value={loot.date || ""}
            onChange={(e) =>
              updateLoot(playerIndex, lootIndex, { date: e.target.value })
            }
          />
        )}
      </div>
    );
  };

  const tableColumns: ColumnDef<Player>[] = [
    {
      accessorKey: "username",
      header: "Ник",
      cell: ({ row }) => row.getValue("username"),
    },
    {
      accessorKey: "active",
      header: "Активен",
      cell: ({ row }) => <Switch checked={row.getValue("active")} disabled />,
    },
    ...lootColumns.map((col, lootIndex) => ({
      id: col,
      header: col,
      cell: ({ row }: { row: Row<Player> }) => {
        const playerIndex = allPlayers.findIndex(
          (p) => p.id === row.original.id
        );
        const loot = row.original.loot[lootIndex];
        return renderLootCell(loot, editMode, playerIndex, lootIndex);
      },
    })),
  ];

  const table = useReactTable({
    data: displayedPlayers,
    columns: tableColumns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: { columnFilters },
    onColumnFiltersChange: setColumnFilters,
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Раздача лута</h2>
        {isAdmin && (
          <Button
            className="cursor-pointer"
            variant="outline"
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? "Сохранить" : "Редактировать"}
          </Button>
        )}
      </div>

      <div className="flex items-center justify-between mb-4">
        <Input
          placeholder="поиск по нику..."
          value={
            (table.getColumn("username")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("username")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <div className="flex items-center gap-2">
          <Switch
            className="cursor-pointer"
            checked={showInactive}
            onCheckedChange={setShowInactive}
          />
          <span className="text-sm text-muted-foreground">
            Показать неактивных
          </span>
        </div>
      </div>

      <Table>
        <TableHeader className="sticky top-0 z-1 bg-background">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
