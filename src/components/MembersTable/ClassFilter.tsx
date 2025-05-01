"use client";

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Table } from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";

interface ClassFilterProps<TData> {
  table: Table<TData>;
}

export function ClassFilter<TData>({ table }: ClassFilterProps<TData>) {
  const selectedClasses =
    (table.getColumn("class")?.getFilterValue() as string[]) ?? [];

  const availableClasses = [
    "Хил",
    "Лук",
    "Милик",
    "Маг",
    "Бард",
    "Тактик",
    "Танцор",
  ];

  const toggleClass = (className: string) => {
    const newSelected = selectedClasses.includes(className)
      ? selectedClasses.filter((c) => c !== className)
      : [...selectedClasses, className];

    table
      .getColumn("class")
      ?.setFilterValue(newSelected.length ? newSelected : undefined);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="ml-auto">
          Фильтр по классу
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {availableClasses.map((className) => (
          <DropdownMenuCheckboxItem
            key={className}
            checked={selectedClasses.includes(className)}
            onSelect={(event) => {
              event.preventDefault();
              toggleClass(className);
            }}
          >
            {className}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
