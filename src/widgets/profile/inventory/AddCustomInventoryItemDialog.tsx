"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { LootIcon } from "@/widgets/Loot/LootBuy/icons/LootIconComponent";
import addItemToUserInventory from "@/actions/addItemToUserInventory";
import { OtherInventoryCatalogItem } from "@/actions/getInventoryCatalog";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui";

// Поиск + выбор уже существующего в каталоге предмета для категорий с
// каталогом (см. catalogCategories в InventoryCategoryGrid) — заводить новые
// сюда нельзя, каталог (см. getInventoryCatalog) пополняется только через
// /items (казна) или напрямую в БД (profile_item_type — для того, чего в
// казне нет и не будет).
export function AddCustomInventoryItemDialog({
  userId,
  type,
  catalog,
  onAdded,
}: {
  userId: number;
  type: string;
  catalog: OtherInventoryCatalogItem[];
  onAdded: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = async (item: OtherInventoryCatalogItem) => {
    setIsOpen(false);
    try {
      await addItemToUserInventory(userId, item.name, type, null);
      toast.success("Предмет добавлен");
      onAdded();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Не удалось добавить предмет",
      );
    }
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-3 text-center text-muted-foreground transition-all duration-150 hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary cursor-pointer"
        >
          <div className="flex items-center justify-center rounded-md border border-transparent p-1">
            <Plus className="size-10" strokeWidth={1} />
          </div>
          <span className="text-xs leading-tight">Добавить предмет</span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[300px]">
        <Command>
          <CommandInput placeholder="Поиск предмета..." />
          <CommandList>
            <CommandEmpty className="px-3 py-4 text-sm text-muted-foreground">
              Ничего не найдено. Новые предметы каталога добавляются на
              странице «Предметы».
            </CommandEmpty>
            {catalog.map((item) => (
              <CommandItem
                key={item.name}
                value={item.name}
                onSelect={() => handleSelect(item)}
                className="flex items-center gap-2 cursor-pointer"
              >
                <LootIcon itemName={item.name} iconUrl={item.icon_url} size={24} />
                <span>{item.name}</span>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
