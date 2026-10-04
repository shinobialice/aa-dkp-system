"use client";
import { useState, type SyntheticEvent } from "react";
import { ChevronDown } from "lucide-react";
import { GearItemIcon } from "./GearItemIcon";
import type { GearItem } from "./itemsData";
import {
  Input,
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
} from "@/shared/ui";
import { cn } from "@/shared/lib/tw-merge";

type Props = {
  items: GearItem[];
  value: string;
  onSelect: (item: GearItem) => void;
};

export default function GearItemPicker({ items, value, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selected = items.find((item) => item.name === value);
  const search = query.trim().toLowerCase();
  const filtered = search
    ? items.filter((item) => item.name.toLowerCase().includes(search))
    : items;

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) setQuery("");
  };

  const handleSelect = (item: GearItem) => {
    onSelect(item);
    handleOpenChange(false);
  };

  // The list is portaled out of the dialog, and the dialog's scroll lock
  // cancels wheel and touch scrolling that happens outside of it.
  const handleScrollEvent = (event: SyntheticEvent) => event.stopPropagation();

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-md border bg-input/30 px-3 py-2 text-sm"
        >
          <SelectedItem item={selected} />
          <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverContent
          align="start"
          collisionPadding={8}
          onWheel={handleScrollEvent}
          onTouchMove={handleScrollEvent}
          className="dark flex max-h-(--radix-popover-content-available-height) w-(--radix-popover-trigger-width) flex-col border-border p-0"
        >
          <div className="shrink-0 p-1.5">
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Начните вводить название..."
              autoComplete="off"
            />
          </div>
          <div className="max-h-80 min-h-0 space-y-0.5 overflow-y-auto p-1">
            {filtered.length === 0 && (
              <div className="px-2 py-1.5 text-sm text-muted-foreground">
                Ничего не найдено
              </div>
            )}
            {filtered.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelect(item)}
                className={cn(
                  "flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-left text-sm hover:bg-accent",
                  value === item.name && "bg-accent",
                )}
              >
                <GearItemIcon item={item} grade={item.grade} size={28} />
                <span className="min-w-0 flex-1 truncate">{item.name}</span>
              </button>
            ))}
          </div>
        </PopoverContent>
      </PopoverPortal>
    </Popover>
  );
}

function SelectedItem({ item }: { item: GearItem | undefined }) {
  if (!item) {
    return <span className="text-muted-foreground">Выберите предмет</span>;
  }
  return (
    <span className="flex min-w-0 flex-1 items-center gap-2">
      <GearItemIcon item={item} grade={item.grade} size={20} />
      <span className="min-w-0 flex-1 truncate text-left">{item.name}</span>
    </span>
  );
}
