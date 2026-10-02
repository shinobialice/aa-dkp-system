"use client";

import { useState, type ReactNode } from "react";
import {
  ArrowDownLeft,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Landmark,
  Minus,
  Plus,
} from "lucide-react";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui";
import { getYearOptions } from "@/utils/getYearOptions";
import { monthName } from "./treasuryModel";

function MonthPicker({
  month,
  year,
  onChange,
}: {
  month: number;
  year: number;
  onChange: (month: number, year: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(year);
  const now = new Date();
  const years = getYearOptions();
  const current = now.getFullYear() * 12 + now.getMonth();
  const selected = year * 12 + month - 1;
  const first = years[0] * 12;

  const go = (value: number) => onChange((value % 12) + 1, Math.floor(value / 12));

  return (
    <div className="flex h-9 items-center rounded-md border bg-background shadow-xs">
      <Button
        variant="ghost"
        size="icon"
        className="h-full rounded-r-none"
        aria-label="Предыдущий месяц"
        disabled={selected <= first}
        onClick={() => go(selected - 1)}
      >
        <ChevronLeft />
      </Button>
      <Popover
        open={open}
        onOpenChange={(next) => {
          setOpen(next);
          if (next) setViewYear(year);
        }}
      >
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
            {Array.from({ length: 12 }, (_, index) => {
              const value = viewYear * 12 + index;
              return (
                <Button
                  key={index}
                  size="sm"
                  variant={value === selected ? "default" : "ghost"}
                  className="capitalize"
                  disabled={value > current || value < first}
                  onClick={() => {
                    go(value);
                    setOpen(false);
                  }}
                >
                  {monthName(index + 1)}
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
        onClick={() => go(selected + 1)}
      >
        <ChevronRight />
      </Button>
    </div>
  );
}

function AddMenuItem({
  icon,
  title,
  hint,
  onSelect,
}: {
  icon: ReactNode;
  title: string;
  hint: string;
  onSelect: () => void;
}) {
  return (
    <DropdownMenuItem className="cursor-pointer items-start gap-3 py-2" onSelect={onSelect}>
      <span className="mt-0.5">{icon}</span>
      <span className="flex flex-col">
        <span className="font-medium">{title}</span>
        <span className="text-xs text-muted-foreground">{hint}</span>
      </span>
    </DropdownMenuItem>
  );
}

export function TreasuryHeader({
  month,
  year,
  isAdmin,
  onMonthChange,
  onAddDrop,
  onAddTreasury,
  onAddExpense,
}: {
  month: number;
  year: number;
  isAdmin: boolean;
  onMonthChange: (month: number, year: number) => void;
  onAddDrop: () => void;
  onAddTreasury: () => void;
  onAddExpense: () => void;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight">Казна</h1>
        <p className="text-sm text-muted-foreground">
          Склад лута гильдии, продажи и расходы
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <MonthPicker month={month} year={year} onChange={onMonthChange} />
        {isAdmin && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button>
                <Plus />
                Добавить
                <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64">
              <AddMenuItem
                icon={<ArrowDownLeft className="text-blue-600 dark:text-blue-400" />}
                title="Дроп с босса"
                hint="Предмет попадёт на склад"
                onSelect={onAddDrop}
              />
              <AddMenuItem
                icon={<Landmark className="text-orange-600 dark:text-orange-400" />}
                title="Золото в казну"
                hint="Сразу деньгами, без предмета"
                onSelect={onAddTreasury}
              />
              <AddMenuItem
                icon={<Minus />}
                title="Расход"
                hint="Покупки, пробуды, награды"
                onSelect={onAddExpense}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
}
