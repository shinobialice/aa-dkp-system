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
import { X } from "lucide-react";
import { lootColumns } from "./lootColumns";
import { gliderTypes } from "./gliderTypes";
import { Button } from "@/shared/ui";
import { Input } from "@/shared/ui";
import { Switch } from "@/shared/ui";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/shared/ui";
import { saveGivenAwayLoot } from "@/actions/saveGivenAwayLoot";
import {
  addMiscLootGrant,
  deleteMiscLootGrant,
  type MiscLootGrant,
} from "@/actions/miscLootGrants";
import {
  addWishlistItem,
  deleteWishlistItem,
  type WishlistItem,
} from "@/actions/lootWishlist";

const NONE_STATUS = "__none__";

type LootItem = {
  name: string;
  date: string;
  status: string;
};

type GliderItem = {
  type: string;
  date: string;
  status: string;
};

type Player = {
  id: number;
  username: string;
  active: boolean;
  loot: LootItem[];
  gliders: GliderItem[];
  miscGrants: MiscLootGrant[];
  wishlist: WishlistItem[];
};

type LootGiveawayProps = {
  initialPlayers: Player[];
  isAdmin: boolean; // Add isAdmin prop
};

function AddMiscGrantForm({
  onAdd,
}: {
  onAdd: (grant: { comment: string; amount: number | null; date: string }) => void;
}) {
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(() => new Date().toISOString().split("T")[0]);

  if (!open) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-6 px-2 text-xs cursor-pointer justify-start"
        onClick={() => setOpen(true)}
      >
        + добавить
      </Button>
    );
  }

  const handleSubmit = () => {
    if (!comment.trim()) return;
    onAdd({ comment: comment.trim(), amount: amount ? Number(amount) : null, date });
    setComment("");
    setAmount("");
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-1 border rounded p-1">
      <Input
        placeholder="Комментарий"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="text-xs h-7"
      />
      <div className="flex items-center gap-1">
        <Input
          type="number"
          placeholder="Сумма"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="text-xs h-7 w-20"
        />
        <input
          type="date"
          className="text-xs border rounded px-1 py-0.5 h-7 flex-1"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-1">
        <Button
          type="button"
          size="sm"
          className="h-6 px-2 text-xs cursor-pointer"
          disabled={!comment.trim()}
          onClick={handleSubmit}
        >
          Добавить
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs cursor-pointer"
          onClick={() => setOpen(false)}
        >
          Отмена
        </Button>
      </div>
    </div>
  );
}

function AddWishlistForm({
  onAdd,
}: {
  onAdd: (item: { itemName: string; comment: string }) => void;
}) {
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [comment, setComment] = useState("");

  if (!open) {
    return (
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="h-6 px-2 text-xs cursor-pointer justify-start"
        onClick={() => setOpen(true)}
      >
        + добавить
      </Button>
    );
  }

  const handleSubmit = () => {
    if (!itemName.trim()) return;
    onAdd({ itemName: itemName.trim(), comment: comment.trim() });
    setItemName("");
    setComment("");
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-1 border rounded p-1">
      <Input
        placeholder="Название предмета"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
        className="text-xs h-7"
      />
      <Input
        placeholder="Комментарий (необязательно)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="text-xs h-7"
      />
      <div className="flex items-center gap-1">
        <Button
          type="button"
          size="sm"
          className="h-6 px-2 text-xs cursor-pointer"
          disabled={!itemName.trim()}
          onClick={handleSubmit}
        >
          Добавить
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-6 px-2 text-xs cursor-pointer"
          onClick={() => setOpen(false)}
        >
          Отмена
        </Button>
      </div>
    </div>
  );
}

export default function LootGiveaway({
  initialPlayers,
  isAdmin,
}: LootGiveawayProps) {
  const [allPlayers, setAllPlayers] = useState<Player[]>(initialPlayers);
  const [editMode, setEditMode] = useState(false);
  const [showInactive, setShowInactive] = useState(false);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const displayedPlayers = useMemo(
    () => allPlayers.filter((p) => p.active || showInactive),
    [allPlayers, showInactive],
  );

  const updateLoot = (
    playerIndex: number,
    lootIndex: number,
    changes: Partial<LootItem>,
  ) => {
    const updated = [...allPlayers];
    const loot = updated[playerIndex].loot[lootIndex];
    Object.assign(loot, changes);
    setAllPlayers(updated);

    const { name, date, status } = loot;
    const isValidDate = date && !isNaN(Date.parse(date));
    if (status && (status === "Выдано" ? isValidDate : true)) {
      startTransition(() => {
        saveGivenAwayLoot(updated[playerIndex].id, {
          name,
          date: isValidDate ? date : new Date().toISOString().split("T")[0],
          status,
        });
      });
    }
  };

  const updateGlider = (
    playerIndex: number,
    type: string,
    changes: Partial<GliderItem>,
  ) => {
    const updated = [...allPlayers];
    const glider = updated[playerIndex].gliders.find((g) => g.type === type);
    if (!glider) return;
    Object.assign(glider, changes);
    setAllPlayers(updated);

    const { date, status } = glider;
    const isValidDate = date && !isNaN(Date.parse(date));
    if (status && (status === "Выдано" ? isValidDate : true)) {
      startTransition(() => {
        saveGivenAwayLoot(updated[playerIndex].id, {
          name: type,
          date: isValidDate ? date : new Date().toISOString().split("T")[0],
          status,
        });
      });
    }
  };

  const removeGlider = (playerIndex: number, type: string) => {
    const updated = [...allPlayers];
    const glider = updated[playerIndex].gliders.find((g) => g.type === type);
    if (!glider) return;
    glider.date = "";
    glider.status = "";
    setAllPlayers(updated);

    startTransition(() => {
      saveGivenAwayLoot(updated[playerIndex].id, {
        name: type,
        date: new Date().toISOString().split("T")[0],
        status: "",
      });
    });
  };

  const handleAddMiscGrant = async (
    playerIndex: number,
    grant: { comment: string; amount: number | null; date: string },
  ) => {
    const created = await addMiscLootGrant(allPlayers[playerIndex].id, grant);
    const updated = [...allPlayers];
    updated[playerIndex] = {
      ...updated[playerIndex],
      miscGrants: [...updated[playerIndex].miscGrants, created].sort((a, b) =>
        a.date.localeCompare(b.date),
      ),
    };
    setAllPlayers(updated);
  };

  const handleRemoveMiscGrant = (playerIndex: number, id: number) => {
    const updated = [...allPlayers];
    updated[playerIndex] = {
      ...updated[playerIndex],
      miscGrants: updated[playerIndex].miscGrants.filter((g) => g.id !== id),
    };
    setAllPlayers(updated);

    startTransition(() => {
      deleteMiscLootGrant(id);
    });
  };

  const handleAddWishlistItem = async (
    playerIndex: number,
    item: { itemName: string; comment: string },
  ) => {
    const created = await addWishlistItem(allPlayers[playerIndex].id, item);
    const updated = [...allPlayers];
    updated[playerIndex] = {
      ...updated[playerIndex],
      wishlist: [...updated[playerIndex].wishlist, created],
    };
    setAllPlayers(updated);
  };

  const handleRemoveWishlistItem = (playerIndex: number, id: number) => {
    const updated = [...allPlayers];
    updated[playerIndex] = {
      ...updated[playerIndex],
      wishlist: updated[playerIndex].wishlist.filter((w) => w.id !== id),
    };
    setAllPlayers(updated);

    startTransition(() => {
      deleteWishlistItem(id);
    });
  };

  const renderGliderCell = (
    gliders: GliderItem[],
    isEditMode: boolean,
    playerIndex: number,
  ) => {
    const given = gliders.filter((g) => g.status);

    if (!isEditMode) {
      if (given.length === 0) return "–";
      return given
        .map((g) => {
          const dateValid = g.date && !isNaN(Date.parse(g.date));
          if (g.status === "Выдано") {
            return dateValid
              ? `${g.type} (${format(new Date(g.date), "dd.MM.yyyy")})`
              : g.type;
          }
          return `${g.type}: В наличии`;
        })
        .join(", ");
    }

    const available = gliders.filter((g) => !g.status);

    return (
      <div className="flex flex-col gap-1 min-w-48">
        {given.map((g) => (
          <div key={g.type} className="flex items-center gap-1">
            <span className="text-xs flex-1">{g.type}</span>
            <Select
              value={g.status}
              onValueChange={(value) =>
                updateGlider(playerIndex, g.type, { status: value })
              }
            >
              <SelectTrigger size="sm" className="h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Выдано">Выдано</SelectItem>
                <SelectItem value="В наличии">В наличии</SelectItem>
              </SelectContent>
            </Select>
            {g.status === "Выдано" && (
              <input
                type="date"
                className="text-xs border rounded px-1 py-0.5"
                value={g.date}
                onChange={(e) =>
                  updateGlider(playerIndex, g.type, { date: e.target.value })
                }
              />
            )}
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="size-6 cursor-pointer text-muted-foreground"
              onClick={() => removeGlider(playerIndex, g.type)}
            >
              <X />
            </Button>
          </div>
        ))}
        {available.length > 0 && (
          <Select
            value=""
            onValueChange={(value) =>
              updateGlider(playerIndex, value, { status: "Выдано" })
            }
          >
            <SelectTrigger size="sm" className="h-7 w-full text-xs">
              <SelectValue placeholder="+ добавить глайдер" />
            </SelectTrigger>
            <SelectContent>
              {available.map((g) => (
                <SelectItem key={g.type} value={g.type}>
                  {g.type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>
    );
  };

  const renderLootCell = (
    loot: LootItem,
    isEditMode: boolean,
    playerIndex: number,
    lootIndex: number,
  ) => {
    const dateValid = loot.date && !isNaN(Date.parse(loot.date));

    if (!isEditMode) {
      if (loot.status === "В наличии") {
        return "В наличии";
      }
      if (loot.status === "Выдано") {
        return dateValid
          ? `Выдано (${format(new Date(loot.date), "dd.MM.yyyy")})`
          : "Выдано";
      }
      return "–";
    }

    return (
      <div className="flex flex-col gap-1">
        <Select
          value={loot.status || NONE_STATUS}
          onValueChange={(value) =>
            updateLoot(playerIndex, lootIndex, {
              status: value === NONE_STATUS ? "" : value,
            })
          }
        >
          <SelectTrigger size="sm" className="h-7 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={NONE_STATUS}>–</SelectItem>
            <SelectItem value="Выдано">Выдано</SelectItem>
            <SelectItem value="В наличии">В наличии</SelectItem>
          </SelectContent>
        </Select>

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

  const renderMiscCell = (
    grants: MiscLootGrant[],
    isEditMode: boolean,
    playerIndex: number,
  ) => {
    const formatGrant = (g: MiscLootGrant) => {
      const dateValid = g.date && !isNaN(Date.parse(g.date));
      const amountPart = g.amount != null ? `${g.amount}: ` : "";
      const datePart = dateValid
        ? ` (${format(new Date(g.date), "dd.MM.yyyy")})`
        : "";
      return `${amountPart}${g.comment}${datePart}`;
    };

    if (!isEditMode) {
      if (grants.length === 0) return "–";
      return grants.map(formatGrant).join("; ");
    }

    return (
      <div className="flex flex-col gap-1 min-w-48">
        {grants.map((g) => (
          <div key={g.id} className="flex items-center gap-1">
            <span className="text-xs flex-1">{formatGrant(g)}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="size-6 cursor-pointer text-muted-foreground"
              onClick={() => handleRemoveMiscGrant(playerIndex, g.id)}
            >
              <X />
            </Button>
          </div>
        ))}
        <AddMiscGrantForm
          onAdd={(grant) => handleAddMiscGrant(playerIndex, grant)}
        />
      </div>
    );
  };

  const renderWishlistCell = (
    wishlist: WishlistItem[],
    isEditMode: boolean,
    playerIndex: number,
  ) => {
    const formatItem = (w: WishlistItem) =>
      w.comment ? `${w.itemName} (${w.comment})` : w.itemName;

    if (!isEditMode) {
      if (wishlist.length === 0) return "–";
      return wishlist.map(formatItem).join(", ");
    }

    return (
      <div className="flex flex-col gap-1 min-w-48">
        {wishlist.map((w) => (
          <div key={w.id} className="flex items-center gap-1">
            <span className="text-xs flex-1">{formatItem(w)}</span>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="size-6 cursor-pointer text-muted-foreground"
              onClick={() => handleRemoveWishlistItem(playerIndex, w.id)}
            >
              <X />
            </Button>
          </div>
        ))}
        <AddWishlistForm
          onAdd={(item) => handleAddWishlistItem(playerIndex, item)}
        />
      </div>
    );
  };

  const lootTableColumns: ColumnDef<Player>[] = lootColumns.map(
    (col, lootIndex) => ({
      id: col,
      header: col,
      cell: ({ row }: { row: Row<Player> }) => {
        const playerIndex = allPlayers.findIndex(
          (p) => p.id === row.original.id,
        );
        const loot = row.original.loot[lootIndex];
        return renderLootCell(loot, editMode, playerIndex, lootIndex);
      },
    }),
  );

  const gliderColumn: ColumnDef<Player> = {
    id: "Глайдер",
    header: "Глайдер",
    cell: ({ row }) => {
      const playerIndex = allPlayers.findIndex((p) => p.id === row.original.id);
      return renderGliderCell(row.original.gliders, editMode, playerIndex);
    },
  };

  const andhakarIndex = lootColumns.indexOf("Анд'хакар, Чернильная тьма");
  lootTableColumns.splice(andhakarIndex + 1, 0, gliderColumn);

  const miscColumn: ColumnDef<Player> = {
    id: "Прочее",
    header: "Прочее",
    cell: ({ row }) => {
      const playerIndex = allPlayers.findIndex((p) => p.id === row.original.id);
      return renderMiscCell(row.original.miscGrants, editMode, playerIndex);
    },
  };
  lootTableColumns.push(miscColumn);

  const wishlistColumn: ColumnDef<Player> = {
    id: "Хочет",
    header: "Хочет",
    cell: ({ row }) => {
      const playerIndex = allPlayers.findIndex((p) => p.id === row.original.id);
      return renderWishlistCell(row.original.wishlist, editMode, playerIndex);
    },
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
    ...lootTableColumns,
    wishlistColumn,
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
                    header.getContext(),
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
