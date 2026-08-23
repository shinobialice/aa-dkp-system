"use client";
import { useRef, useState } from "react";
import { LootIcon } from "../LootBuy/icons/LootIconComponent";
import { ItemType } from "./LootTypes";
import { Command, CommandInput, CommandItem, CommandList } from "@/shared/ui";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui";

export function LootItemSelector({
  value,
  onSelect,
  itemTypes,
}: {
  value: string;
  onSelect: (name: string) => void;
  itemTypes: ItemType[];
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
          className="border rounded px-2 py-1 cursor-pointer"
          onClick={() => setIsOpen(true)}
        />
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[378px]">
        <Command>
          <CommandInput placeholder="Поиск..." />
          <CommandList className="cursor-pointer">
            {itemTypes.map((item) => (
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
                <LootIcon
                  itemName={item.name}
                  iconUrl={item.icon_url}
                  grade={item.grade}
                  size={24}
                />
                <span>{item.name}</span>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
