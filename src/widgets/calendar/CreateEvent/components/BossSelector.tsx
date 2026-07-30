import React from "react";
import { Button } from "@/shared/ui";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
} from "@/shared/ui";
import { Label } from "@/shared/ui";
import { ChevronDown } from "lucide-react";

export default function BossSelector({
  category,
  bosses,
  selectedBoss,
  onSelectBoss,
  errors,
}: {
  category: string | null;
  bosses: any[];
  selectedBoss: string | null;
  onSelectBoss: (boss: any) => void;
  errors: { selectedBoss: boolean };
}) {
  const aglBossOrder = ["АГЛ", "Морф", "Марли Прок", "Кошка"];

  if (category === "Прайм") {
    return (
      <>
        <Label>Босс</Label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-[270px] justify-between cursor-pointer"
            >
              {selectedBoss || "Выберите босса"}
              <ChevronDown className="ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[270px] max-h-80 overflow-y-auto">
            {bosses
              .filter((boss) => boss.category === "Прайм")
              .map((boss) => (
                <DropdownMenuCheckboxItem
                  key={boss.id}
                  checked={selectedBoss === boss.boss_name}
                  onCheckedChange={() => onSelectBoss(boss)}
                >
                  {boss.boss_name}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
        {errors.selectedBoss && (
          <p className="text-sm text-red-500">Обязательное поле</p>
        )}
      </>
    );
  }

  if (category === "АГЛ") {
    return (
      <>
        <Label>Босс</Label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-[270px] justify-between cursor-pointer"
            >
              {selectedBoss || "Выберите босса"}
              <ChevronDown className="ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[270px] max-h-80 overflow-y-auto">
            {aglBossOrder.map((name) => {
              const boss = bosses.find(
                (b) =>
                  b.boss_name.trim().toLowerCase() === name.trim().toLowerCase(),
              );
              if (!boss) return null;

              return (
                <DropdownMenuCheckboxItem
                  className="cursor-pointer"
                  key={name}
                  checked={selectedBoss === boss.boss_name}
                  onCheckedChange={() => onSelectBoss(boss)}
                >
                  {boss.boss_name}
                </DropdownMenuCheckboxItem>
              );
            })}
          </DropdownMenuContent>
        </DropdownMenu>
        {errors.selectedBoss && (
          <p className="text-sm text-red-500">Обязательное поле</p>
        )}
      </>
    );
  }

  return null;
}
