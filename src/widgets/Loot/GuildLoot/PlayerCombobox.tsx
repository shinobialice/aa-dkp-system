"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/shared/lib/tw-merge";
import {
  Button,
  Command,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui";

export type PlayerOption = { id: number; username: string };

export type PlayerChoice = { name: string; id?: number };

type Props = {
  id?: string;
  users: PlayerOption[];
  value: PlayerChoice;
  onChange: (choice: PlayerChoice) => void;
};

export default function PlayerCombobox({ id, users, value, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(value.name);
  const sortedUsers = [...users].sort((a, b) =>
    a.username.localeCompare(b.username, "ru"),
  );

  const handleSearch = (name: string) => {
    setSearch(name);
    onChange({ name });
  };

  const handleSelect = (user: PlayerOption) => {
    setSearch(user.username);
    onChange({ name: user.username, id: user.id });
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between font-normal",
            !value.name && "text-muted-foreground",
          )}
        >
          <span className="truncate">
            {value.name || "Выберите или введите игрока"}
          </span>
          <ChevronsUpDown className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[var(--radix-popover-trigger-width)] p-0"
        align="start"
      >
        <Command>
          <CommandInput
            placeholder="Поиск игрока…"
            value={search}
            onValueChange={handleSearch}
          />
          <CommandList>
            {sortedUsers.map((user) => (
              <CommandItem
                key={user.id}
                value={user.username}
                className="cursor-pointer"
                onSelect={() => handleSelect(user)}
              >
                <Check
                  className={cn(
                    value.name === user.username ? "opacity-100" : "opacity-0",
                  )}
                />
                {user.username}
              </CommandItem>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
