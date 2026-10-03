"use client";

import { useMemo, useState } from "react";
import { useAsyncData } from "@/hooks/useAsyncData";
import { toast } from "sonner";
import { Plus, Search } from "lucide-react";
import { ItemTypeForm } from "./ItemTypeForm";
import {
  getItemTypesForAdmin,
  deleteItemType,
  type ItemTypeRow,
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
import { errorMessage } from "@/shared/lib/errorMessage";
import { type SortKey, filterAndSortItems } from "./itemTypeSort";
import SortableHead from "./SortableHead";
import ItemTypeRowView from "./ItemTypeRowView";

const EMPTY_ITEMS: ItemTypeRow[] = [];

export function ItemTypeTable() {
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<ItemTypeRow | null>(null);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const {
    data,
    isLoading: loading,
    reload,
  } = useAsyncData("item-types", getItemTypesForAdmin);
  const items = data ?? EMPTY_ITEMS;

  const openEdit = (item: ItemTypeRow | null) => {
    setEditing(item);
    setFormOpen(true);
  };

  const handleDelete = async (item: ItemTypeRow) => {
    if (!confirm(`Удалить предмет «${item.name}»?`)) return;
    try {
      await deleteItemType(item.id);
      toast.success("Предмет удалён");
      reload();
    } catch (error) {
      toast.error(errorMessage(error, "Не удалось удалить предмет"));
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

  const visibleItems = useMemo(
    () => filterAndSortItems(items, search, sortKey, sortDir),
    [items, search, sortKey, sortDir],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground max-w-md">
          Предметы казны, лута и покупки лута. Новый предмет сразу становится
          доступен для выбора при добавлении дохода в казну.
        </p>
        <Button
          className="cursor-pointer shrink-0"
          onClick={() => openEdit(null)}
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
            <SortableHead
              column="name"
              sortKey={sortKey}
              sortDir={sortDir}
              onSort={handleSort}
            >
              Название
            </SortableHead>
            <SortableHead
              column="price"
              sortKey={sortKey}
              sortDir={sortDir}
              onSort={handleSort}
            >
              Цена
            </SortableHead>
            <SortableHead
              column="source"
              sortKey={sortKey}
              sortDir={sortDir}
              onSort={handleSort}
            >
              Источник
            </SortableHead>
            <SortableHead
              column="category"
              sortKey={sortKey}
              sortDir={sortDir}
              onSort={handleSort}
            >
              Категория
            </SortableHead>
            <SortableHead
              column="show_in_buy"
              sortKey={sortKey}
              sortDir={sortDir}
              onSort={handleSort}
            >
              В покупке
            </SortableHead>
            <TableHead className="w-35">Действия</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {visibleItems.map((item) => (
            <ItemTypeRowView
              key={item.id}
              item={item}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))}
          {!loading && visibleItems.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center text-muted-foreground"
              >
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
