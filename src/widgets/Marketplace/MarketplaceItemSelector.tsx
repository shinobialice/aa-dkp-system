"use client";

import { useRef, useState } from "react";
import { Package } from "lucide-react";
import { MarketplaceItemTypeRow } from "@/actions/marketplaceItemTypeAdmin";
import { Command, CommandInput, CommandItem, CommandList, CommandEmpty } from "@/shared/ui";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui";

// Тот же паттерн, что и LootItemSelector (казна/лут), но без рамки редкости —
// у каталога доски объявлений (marketplace_item_type) её нет: просто
// название + иконка, без грейда.
export function MarketplaceItemSelector({
  value,
  onSelect,
  catalogItems,
}: {
  value: string;
  onSelect: (name: string) => void;
  catalogItems: MarketplaceItemTypeRow[];
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <input
          ref={inputRef}
          type="text"
          placeholder="Поиск предмета..."
          value={value}
          readOnly
          className="border rounded px-2 py-1 cursor-pointer w-full"
          onClick={() => setIsOpen(true)}
        />
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[378px]">
        <Command>
          <CommandInput placeholder="Поиск..." />
          <CommandList className="cursor-pointer">
            <CommandEmpty className="px-3 py-4 text-sm text-muted-foreground">
              Ничего не найдено. Новые предметы каталога добавляются на
              странице «Предметы» (вкладка «Доска объявлений»).
            </CommandEmpty>
            {catalogItems.map((item) => (
              <CommandItem
                key={item.id}
                value={item.name}
                onSelect={() => {
                  onSelect(item.name);
                  setIsOpen(false);
                  inputRef.current?.blur();
                }}
                className="flex items-center gap-2 cursor-pointer"
              >
                {item.icon_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.icon_url}
                    alt=""
                    className="rounded object-cover"
                    style={{ width: 24, height: 24 }}
                  />
                ) : (
                  <Package className="size-6 text-muted-foreground" />
                )}
                <span>{item.name}</span>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
