"use client";

import { useRef, useState } from "react";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui";
import { LootIcon } from "../LootBuy/icons/LootIconComponent";
import type { ItemType } from "./LootTypes";

type Props = {
  value: string;
  itemTypes: ItemType[];
  onSelect: (name: string) => void;
};

export default function LootItemSelector({
  value,
  itemTypes,
  onSelect,
}: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (name: string) => {
    onSelect(name);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <input
          ref={inputRef}
          type="text"
          placeholder="Поиск предмета..."
          value={value}
          readOnly
          className="cursor-pointer rounded border px-2 py-1"
          onClick={() => setIsOpen(true)}
        />
      </PopoverTrigger>
      <PopoverContent className="w-94.5 p-0">
        <Command>
          <CommandInput placeholder="Поиск..." />
          <CommandList className="cursor-pointer">
            {itemTypes.map((item) => (
              <CommandItem
                key={item.id}
                value={item.name}
                onSelect={() => handleSelect(item.name)}
                className="flex cursor-pointer items-center gap-2"
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
