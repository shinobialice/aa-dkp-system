"use client";

import { Table } from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ClassFilterProps<TData> = {
  table: Table<TData>;
};

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
        <Button variant="outline" className="ml-auto cursor-pointer">
          Фильтр по классу
          <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className=" w-[170px]">
        {availableClasses.map((className) => (
          <DropdownMenuCheckboxItem
            className="cursor-pointer"
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
