"use client";

import { useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Button, Popover, PopoverContent, PopoverTrigger } from "@/shared/ui";
import { getYearOptions } from "@/utils/getYearOptions";
import { monthName } from "./treasuryModel";

type Props = {
  month: number;
  year: number;
  onChange: (month: number, year: number) => void;
};

export default function TreasuryMonthPicker({ month, year, onChange }: Props) {
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(year);
  const now = new Date();
  const years = getYearOptions();
  const current = now.getFullYear() * 12 + now.getMonth();
  const selected = year * 12 + month - 1;
  const first = years[0] * 12;

  const goTo = (index: number) =>
    onChange((index % 12) + 1, Math.floor(index / 12));

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (next) setViewYear(year);
  };

  const handlePick = (index: number) => {
    goTo(index);
    setOpen(false);
  };

  return (
    <div className="flex h-9 items-center rounded-md border bg-background shadow-xs">
      <Button
        variant="ghost"
        size="icon"
        className="h-full rounded-r-none"
        aria-label="Предыдущий месяц"
        disabled={selected <= first}
        onClick={() => goTo(selected - 1)}
      >
        <ChevronLeft />
      </Button>
      <Popover open={open} onOpenChange={handleOpenChange}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            className="h-full rounded-none border-x px-3 font-semibold capitalize"
          >
            {monthName(month)} {year}
            <ChevronDown className="text-muted-foreground" />
          </Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-72 p-3">
          <div className="mb-2 flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Предыдущий год"
              disabled={viewYear <= years[0]}
              onClick={() => setViewYear(viewYear - 1)}
            >
              <ChevronLeft />
            </Button>
            <span className="text-sm font-semibold">{viewYear}</span>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Следующий год"
              disabled={viewYear >= now.getFullYear()}
              onClick={() => setViewYear(viewYear + 1)}
            >
              <ChevronRight />
            </Button>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {Array.from({ length: 12 }, (_, monthIndex) => {
              const index = viewYear * 12 + monthIndex;
              return (
                <Button
                  key={monthIndex}
                  size="sm"
                  variant={index === selected ? "default" : "ghost"}
                  className="capitalize"
                  disabled={index > current || index < first}
                  onClick={() => handlePick(index)}
                >
                  {monthName(monthIndex + 1)}
                </Button>
              );
            })}
          </div>
        </PopoverContent>
      </Popover>
      <Button
        variant="ghost"
        size="icon"
        className="h-full rounded-l-none"
        aria-label="Следующий месяц"
        disabled={selected >= current}
        onClick={() => goTo(selected + 1)}
      >
        <ChevronRight />
      </Button>
    </div>
  );
}
