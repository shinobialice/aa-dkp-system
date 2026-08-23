"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus, ArrowUp, ArrowDown, ChevronsUpDown, Search } from "lucide-react";
import { ItemTypeForm } from "./ItemTypeForm";
import { LootIcon } from "@/widgets/Loot/LootBuy/icons/LootIconComponent";
import {
  getItemTypesForAdmin,
  deleteItemType,
  ItemTypeRow,
} from "@/actions/itemTypeAdmin";
import {
  Button,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui";

type SortKey = "name" | "price" | "source" | "show_in_buy";

function compareValues(a: string | number | null, b: string | number | null) {
  if (a == null && b == null) return 0;
  if (a == null) return 1;
  if (b == null) return -1;
  if (typeof a === "number" && typeof b === "number") return a - b;
  return String(a).localeCompare(String(b), "ru");
}

function SortIcon({
  column,
  sortKey,
  sortDir,
}: {
  column: SortKey;
  sortKey: SortKey;
  sortDir: "asc" | "desc";
}) {
  if (column !== sortKey) {
    return <ChevronsUpDown className="size-3.5 text-muted-foreground" />;
  }
  return sortDir === "asc" ? (
    <ArrowUp className="size-3.5" />
  ) : (
    <ArrowDown className="size-3.5" />
  );
}

function SortableHead({
  column,
  sortKey,
  sortDir,
  onSort,
  children,
}: {
  column: SortKey;
  sortKey: SortKey;
  sortDir: "asc" | "desc";
  onSort: (column: SortKey) => void;
  children: React.ReactNode;
}) {
  return (
    <TableHead>
      <button
        type="button"
        onClick={() => onSort(column)}
        className="flex items-center gap-1 cursor-pointer hover:text-foreground"
      >
        {children}
        <SortIcon column={column} sortKey={sortKey} sortDir={sortDir} />
      </button>
    </TableHead>
  );
}

export function ItemTypeTable() {
  const [items, setItems] = useState<ItemTypeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ItemTypeRow | null>(null);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const reload = () => {
    getItemTypesForAdmin()
      .then(setItems)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    reload();
  }, []);

  const handleDelete = async (item: ItemTypeRow) => {
    if (!confirm(`Удалить предмет «${item.name}»?`)) return;
    try {
      await deleteItemType(item.id);
      toast.success("Предмет удалён");
      reload();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Не удалось удалить предмет",
      );
    }
  };

  const handleSort = (key: SortKey) => {
    if (key === sortKey) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const visibleItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    const filtered = query
      ? items.filter(
          (item) =>
            item.name.toLowerCase().includes(query) ||
            (item.source ?? "").toLowerCase().includes(query),
        )
      : items;

    const sorted = [...filtered].sort((a, b) => {
      const valueGetters: Record<
        SortKey,
        (i: ItemTypeRow) => string | number | null
      > = {
        name: (i) => i.name,
        price: (i) => i.price,
        source: (i) => i.source,
        show_in_buy: (i) => (i.show_in_buy ? 1 : 0),
      };
      const value = valueGetters[sortKey];
      const result = compareValues(value(a), value(b));
      return sortDir === "asc" ? result : -result;
    });

    return sorted;
  }, [items, search, sortKey, sortDir]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground max-w-md">
          Предметы казны, лута и покупки лута. Новый предмет сразу становится
          доступен для выбора при добавлении дохода в казну.
        </p>
        <Button
          className="cursor-pointer shrink-0"
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
        >
          <Plus className="size-4" />
          Добавить предмет
        </Button>
      </div>

      <div className="relative max-w-xs">
        <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Поиск по названию или боссу..."
          className="pl-8"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Иконка</TableHead>
            <SortableHead column="name" sortKey={sortKey} sortDir={sortDir} onSort={handleSort}>
              Название
            </SortableHead>
            <SortableHead column="price" sortKey={sortKey} sortDir={sortDir} onSort={handleSort}>
              Цена
            </SortableHead>
            <SortableHead column="source" sortKey={sortKey} sortDir={sortDir} onSort={handleSort}>
              Источник
            </SortableHead>
            <SortableHead column="show_in_buy" sortKey={sortKey} sortDir={sortDir} onSort={handleSort}>
              В покупке
            </SortableHead>
            <TableHead className="w-[140px]">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {visibleItems.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <LootIcon
                  itemName={item.name}
                  iconUrl={item.icon_url}
                  grade={item.grade}
                  size={32}
                />
              </TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>{item.price ?? "—"}</TableCell>
              <TableCell>{item.source ?? "Разное"}</TableCell>
              <TableCell>{item.show_in_buy ? "Да" : "Нет"}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="cursor-pointer"
                    onClick={() => {
                      setEditing(item);
                      setFormOpen(true);
                    }}
                  >
                    Изменить
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="cursor-pointer text-destructive hover:text-destructive"
                    onClick={() => handleDelete(item)}
                  >
                    Удалить
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {!loading && visibleItems.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                {items.length === 0
                  ? "Пока нет ни одного предмета"
                  : "Ничего не найдено"}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <ItemTypeForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSaved={reload}
        item={editing}
      />
    </div>
  );
}
