import React from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { ChevronDown } from "lucide-react";

const bossGroups = [
  ["Ашьяра", "Гленн и Лорея"], // Группа, которая дает 1 балл
];

function calculatePoints(selectedBosses: any[]) {
  const uniqueGroups = new Set();

  selectedBosses.forEach((boss) => {
    const group = bossGroups.find((group) => group.includes(boss.boss_name));
    if (group) {
      uniqueGroups.add(group); // Добавляем группу в Set
    } else {
      uniqueGroups.add(boss.boss_name); // Если босс не в группе, добавляем его имя
    }
  });

  return uniqueGroups.size; // Количество уникальных групп и одиночных боссов
}

export default function BossSelector({
  category,
  bosses,
  selectedBoss,
  setSelectedBoss,
  selectedBosses,
  setSelectedBosses,
  setErrors,
  errors,
}: {
  category: string | null;
  bosses: any[];
  selectedBoss: string | null;
  setSelectedBoss: (value: string | null) => void;
  selectedBosses: any[];
  setSelectedBosses: React.Dispatch<React.SetStateAction<any[]>>;
  setErrors: React.Dispatch<React.SetStateAction<any>>;
  errors: { selectedBoss: boolean };
}) {
  const aglBossOrder = [
    "Ашьяра",
    "Ашьяра Прок",
    "Гленн и Лорея",
    "Гленн и Лорея Прок",
    "---",
    "Морф",
    "Марли",
    "Марли Прок",
    "---",
    "Кошка",
  ];

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
                  onSelect={(e) => e.preventDefault()}
                  onCheckedChange={() => {
                    setSelectedBoss(boss.boss_name);
                    setSelectedBosses([boss]);
                    setErrors((prev) => ({ ...prev, selectedBoss: false }));
                  }}
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
        <Label>Боссы (можно выбрать нескольких)</Label>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              className="w-[270px] justify-between cursor-pointer"
            >
              <span className="truncate min-w-0 flex-1 text-left">
                {selectedBosses.length > 0
                  ? selectedBosses.map((b) => b.boss_name).join(", ")
                  : "Выберите боссов"}
              </span>
              <ChevronDown className="ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-64 max-h-80 overflow-y-auto">
            {aglBossOrder.map((name, i) =>
              name === "---" ? (
                <DropdownMenuSeparator key={`sep-${i}`} />
              ) : (
                <DropdownMenuCheckboxItem
                  className="cursor-pointer"
                  key={name}
                  onSelect={(event) => event.preventDefault()}
                  checked={selectedBosses.some((b) => b.boss_name === name)}
                  onCheckedChange={(checked) => {
                    const boss = bosses.find(
                      (b) =>
                        b.boss_name.trim().toLowerCase() ===
                        name.trim().toLowerCase()
                    );
                    if (!boss) return;

                    const updatedBosses = checked
                      ? [...selectedBosses, boss]
                      : selectedBosses.filter((b) => b.id !== boss.id);

                    setSelectedBosses(updatedBosses);
                    setErrors((prev) => ({
                      ...prev,
                      selectedBoss: false,
                    }));

                    const points = calculatePoints(updatedBosses);
                  }}
                >
                  {name}
                </DropdownMenuCheckboxItem>
              )
            )}
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
