"use client";

import { useState, type ReactNode } from "react";
import { Search } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui";
import type { RecognizedWord } from "@/utils/AI/handleOcrUpload";

const MAX_OPTIONS = 8;

type Props = {
  word: RecognizedWord;
  userNames: string[];
  onPick: (username: string) => void;
  children: ReactNode;
};

export default function AssignPopover({
  word,
  userNames,
  onPick,
  children,
}: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const term = search.trim().toLowerCase();
  const options = term
    ? userNames
        .filter((name) => name.toLowerCase().includes(term))
        .slice(0, MAX_OPTIONS)
    : word.candidates;

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) setSearch("");
  };

  const handlePick = (username: string) => {
    onPick(username);
    handleOpenChange(false);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent align="start" className="w-64 p-2">
        <p className="px-1 pb-1.5 text-xs text-muted-foreground">
          Распознано: <b className="text-foreground">{word.text}</b>
        </p>
        <label className="relative mb-1.5 flex items-center">
          <Search className="pointer-events-none absolute left-2 size-3.5 text-muted-foreground" />
          <input
            autoFocus
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Найти игрока"
            aria-label="Найти игрока"
            className="h-8 w-full rounded-md border bg-background pr-2 pl-7 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
          />
        </label>
        <AssignOptions
          options={options}
          isSearching={!!term}
          onPick={handlePick}
        />
      </PopoverContent>
    </Popover>
  );
}

type AssignOptionsProps = {
  options: string[];
  isSearching: boolean;
  onPick: (username: string) => void;
};

function AssignOptions({ options, isSearching, onPick }: AssignOptionsProps) {
  if (options.length === 0) {
    return (
      <p className="px-1 py-2 text-center text-xs text-muted-foreground">
        {isSearching
          ? "Никого не нашлось"
          : "Похожих ников нет — найдите поиском"}
      </p>
    );
  }

  return (
    <ul className="flex flex-col">
      {!isSearching && (
        <li className="px-1 pb-0.5 text-2xs text-muted-foreground">
          Похожие ники
        </li>
      )}
      {options.map((name) => (
        <li key={name}>
          <button
            type="button"
            onClick={() => onPick(name)}
            className="w-full cursor-pointer rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted"
          >
            {name}
          </button>
        </li>
      ))}
    </ul>
  );
}
