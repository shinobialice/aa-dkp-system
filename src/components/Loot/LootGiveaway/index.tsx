"use client";
import { useState, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns";
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
  ColumnFiltersState,
} from "@tanstack/react-table";

interface LootItem {
  name: string;
  date: string;
  comment?: string;
}

interface Player {
  id: number;
  username: string;
  active: boolean;
  loot: LootItem[];
}

const lootColumns = [
  "Ро'кана, Безумие морей",
  "Анд'хакар, Чернильная тьма",
  "Глайдер охотника на драконов",
  "Фрегат",
  "Прочее",
  "Прочее 2",
];

export default function LootGiveaway({
  initialPlayers,
}: {
  initialPlayers: Player[];
}) {
  const [allPlayers, setAllPlayers] = useState<Player[]>(initialPlayers);
  const [editMode, setEditMode] = useState(false);
  const [showInactive, setShowInactive] = useState(false);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const displayedPlayers = useMemo(
    () => allPlayers.filter((p) => p.active || showInactive),
    [allPlayers, showInactive]
  );

  const handleDateChange = (
    playerIndex: number,
    lootIndex: number,
    value: string
  ) => {
    const updated = [...allPlayers];
    updated[playerIndex].loot[lootIndex].date = value;
    setAllPlayers(updated);
  };

  const handleCommentChange = (
    playerIndex: number,
    lootIndex: number,
    value: string
  ) => {
    const updated = [...allPlayers];
    updated[playerIndex].loot[lootIndex].comment = value;
    setAllPlayers(updated);
  };

  const renderLootCell = (
    loot: LootItem,
    isEditMode: boolean,
    playerIndex: number,
    lootIndex: number
  ) => {
    if (isEditMode) {
      if (loot.name.startsWith("Прочее")) {
        return (
          <div className="flex flex-col gap-1">
            <Input
              placeholder="Название предмета"
              value={loot.comment || ""}
              onChange={(e) =>
                handleCommentChange(playerIndex, lootIndex, e.target.value)
              }
              className="text-xs"
            />
            <input
              type="date"
              className="text-xs border rounded px-2 py-1"
              value={loot.date || ""}
              onChange={(e) =>
                handleDateChange(playerIndex, lootIndex, e.target.value)
              }
            />
          </div>
        );
      } else {
        return (
          <div className="flex flex-col gap-1">
            <select
              className="text-xs border rounded px-2 py-1"
              value={loot.date || ""}
              onChange={(e) =>
                handleDateChange(playerIndex, lootIndex, e.target.value)
              }
            >
              <option value="">–</option>
              <option value="in_stock">В наличии</option>
              <option value={new Date().toISOString().split("T")[0]}>
                Сегодня ({new Date().toLocaleDateString("ru-RU")})
              </option>
            </select>
            <input
              type="date"
              className="text-xs border rounded px-2 py-1"
              value={loot.date !== "in_stock" && loot.date ? loot.date : ""}
              onChange={(e) =>
                handleDateChange(playerIndex, lootIndex, e.target.value)
              }
            />
          </div>
        );
      }
    } else {
      if (loot.name.startsWith("Прочее")) {
        if (loot.comment && loot.date) {
          return `${loot.comment} (${format(
            new Date(loot.date),
            "dd.MM.yyyy"
          )})`;
        }
        if (loot.comment) return loot.comment;
        if (loot.date) return format(new Date(loot.date), "dd.MM.yyyy");
        return "–";
      } else {
        if (loot.date === "in_stock") return "В наличии";
        if (loot.date) return format(new Date(loot.date), "dd.MM.yyyy");
        return "–";
      }
    }
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
      cell: ({ row }: any) => {
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
    state: {
      columnFilters,
    },
    onColumnFiltersChange: setColumnFilters,
  });

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Раздача лута</h2>
        <Button
          variant="outline"
          onClick={() => {
            if (editMode) {
              console.log("Сохраняем:", displayedPlayers);
            }
            setEditMode(!editMode);
            setColumnFilters([]);
          }}
        >
          {editMode ? "Сохранить" : "Редактировать"}
        </Button>
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
          <Switch checked={showInactive} onCheckedChange={setShowInactive} />
          <span className="text-sm text-muted-foreground">
            Показать неактивных
          </span>
        </div>
      </div>

      <Table>
        <TableHeader>
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
