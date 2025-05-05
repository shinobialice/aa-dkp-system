import { useRef } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { LootIcon } from "../LootBuy/icons/LootIconComponent";
import { LootIcons } from "../LootBuy/icons/LootIcons";

export function LootItemSelector({
  value,
  onSelect,
}: {
  value: string;
  onSelect: (name: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const allItemNames = Object.keys(LootIcons);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <input
          ref={inputRef}
          type="text"
          placeholder="Поиск предмета..."
          value={value}
          readOnly
          className="border rounded px-2 py-1 cursor-pointer"
        />
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[378px]">
        <Command>
          <CommandInput placeholder="Поиск..." />
          <CommandList>
            {allItemNames.map((name) => (
              <CommandItem
                key={name}
                value={name}
                onSelect={() => {
                  onSelect(name);
                  inputRef.current?.blur();
                }}
                className="flex items-center gap-2"
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
