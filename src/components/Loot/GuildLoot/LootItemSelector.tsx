"use client";
import { useRef, useState } from "react";
import { LootIcon } from "../LootBuy/icons/LootIconComponent";
import { LootIcons } from "../LootBuy/icons/LootIcons";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export function LootItemSelector({
  value,
  onSelect,
}: {
  value: string;
  onSelect: (name: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const allItemNames = Object.keys(LootIcons);
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
            {allItemNames.map((name) => (
              <CommandItem
                key={name}
                value={name}
                onSelect={() => {
                  onSelect(name);
                  setIsOpen(false);
                  inputRef.current?.blur();
                }}
                className="flex items-center gap-2 cursor-pointer"
              >
                <LootIcon itemName={name} size={24} />
                <span>{name}</span>
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
