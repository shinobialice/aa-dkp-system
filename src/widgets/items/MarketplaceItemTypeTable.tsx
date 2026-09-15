"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus, Search } from "lucide-react";
import { MarketplaceItemTypeForm } from "./MarketplaceItemTypeForm";
import { LootIcon } from "@/widgets/Loot/LootBuy/icons/LootIconComponent";
import {
  getMarketplaceItemTypes,
  deleteMarketplaceItemType,
  MarketplaceItemTypeRow,
} from "@/actions/marketplaceItemTypeAdmin";
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

export function MarketplaceItemTypeTable() {
  const [items, setItems] = useState<MarketplaceItemTypeRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<MarketplaceItemTypeRow | null>(null);
  const [search, setSearch] = useState("");

  const reload = () => {
    getMarketplaceItemTypes()
      .then(setItems)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    reload();
  }, []);

  const handleDelete = async (item: MarketplaceItemTypeRow) => {
    if (!confirm(`Удалить предмет «${item.name}»?`)) return;
    try {
      await deleteMarketplaceItemType(item.id);
      toast.success("Предмет удалён");
      reload();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Не удалось удалить предмет",
      );
    }
  };

  const visibleItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return items;
    return items.filter((item) => item.name.toLowerCase().includes(query));
  }, [items, search]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted-foreground max-w-md">
          Каталог предметов для вкладки «Предмет из базы» на доске
          объявлений — отдельный от казны и лута.
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
          placeholder="Поиск по названию..."
          className="pl-8"
        />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Иконка</TableHead>
            <TableHead>Название</TableHead>
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
              <TableCell colSpan={3} className="text-center text-muted-foreground">
                {items.length === 0
                  ? "Пока нет ни одного предмета"
                  : "Ничего не найдено"}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <MarketplaceItemTypeForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSaved={reload}
        item={editing}
      />
    </div>
  );
}
