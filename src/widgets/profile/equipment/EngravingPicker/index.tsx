"use client";
import { useState, type SyntheticEvent } from "react";
import { ChevronDown } from "lucide-react";
import { type Engraving, getEngravingsForSlot } from "../itemsData/engravings";
import type { WeaponHandedness } from "../itemsData/weaponHandedness";
import {
  groupEngravingsByEffect,
  matchesEngravingQuery,
} from "./engravingPickerModel";
import {
  Input,
  Popover,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
} from "@/shared/ui";
import { cn } from "@/shared/lib/tw-merge";
import { EngravingIcon } from "../EngravingIcon";
import EngravingOption from "./EngravingOption";

type Props = {
  slot: string;
  handedness?: WeaponHandedness;
  itemId?: number;
  value: number;
  onSelect: (id: number) => void;
};

const NO_ENGRAVING = 0;

export default function EngravingPicker({
  slot,
  handedness,
  itemId,
  value,
  onSelect,
}: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const available = getEngravingsForSlot(slot, handedness, itemId);
  const selected = available.find((engraving) => engraving.id === value);
  const groups = groupEngravingsByEffect(
    available.filter((engraving) => matchesEngravingQuery(engraving, query)),
  );

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) setQuery("");
  };

  const handleSelect = (id: number) => {
    onSelect(id);
    handleOpenChange(false);
  };

  const handleScrollEvent = (event: SyntheticEvent) => event.stopPropagation();

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-md border bg-input/30 px-3 py-2 text-sm"
        >
          <SelectedEngraving engraving={selected} />
          <ChevronDown className="size-4 shrink-0 text-muted-foreground" />
        </button>
      </PopoverTrigger>
      <PopoverPortal>
        <PopoverContent
          align="start"
          collisionPadding={8}
          onWheel={handleScrollEvent}
          onTouchMove={handleScrollEvent}
          className="dark flex max-h-(--radix-popover-content-available-height) w-(--radix-popover-trigger-width) min-w-80 flex-col border-border p-0"
        >
          <div className="shrink-0 p-1.5">
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Название или эффект, например «крит урон»"
              autoComplete="off"
            />
          </div>
          <div className="max-h-128 min-h-0 overflow-y-auto p-1">
            <button
              type="button"
              onClick={() => handleSelect(NO_ENGRAVING)}
              className={cn(
                "flex w-full cursor-pointer items-center gap-2 rounded px-2 py-1.5 text-left text-sm hover:bg-accent",
                value === NO_ENGRAVING && "bg-accent",
              )}
            >
              <div className="size-5 shrink-0 rounded-sm border border-border bg-muted" />
              <span className="text-muted-foreground">Без гравировки</span>
            </button>
            {groups.length === 0 && (
              <div className="px-2 py-1.5 text-sm text-muted-foreground">
                Ничего не найдено
              </div>
            )}
            {groups.map((group) => (
              <div key={group.label}>
                <div className="sticky -top-1 z-10 bg-popover px-2 pt-2 pb-1 text-xs font-semibold text-muted-foreground">
                  {group.label}
                </div>
                {group.engravings.map((engraving) => (
                  <EngravingOption
                    key={engraving.id}
                    engraving={engraving}
                    isSelected={engraving.id === value}
                    onSelect={handleSelect}
                  />
                ))}
              </div>
            ))}
          </div>
        </PopoverContent>
      </PopoverPortal>
    </Popover>
  );
}

function SelectedEngraving({ engraving }: { engraving?: Engraving }) {
  if (!engraving) {
    return <span className="text-muted-foreground">Выберите гравировку</span>;
  }
  return (
    <span className="flex min-w-0 flex-1 items-center gap-2">
      <EngravingIcon engraving={engraving} size={20} />
      <span className="min-w-0 flex-1 truncate text-left">
        {engraving.name}
      </span>
    </span>
  );
}
