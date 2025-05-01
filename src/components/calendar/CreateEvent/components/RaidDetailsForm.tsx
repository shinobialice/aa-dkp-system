import * as React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

import { getActiveUsers } from "@/src/actions/getActiveUsers";
import DatetimePicker from "./DateTimePicker";
import { eventDkpCalculator } from "@/src/utils/eventDkpCalculator";

export function RaidDetailsForm({
  users,
  setUsers,
  category,
  setCategory,
  selectedBoss,
  setSelectedBoss,
  selectedBosses,
  setSelectedBosses,
  dkpPoints,
  setDkpPoints,
  selectedDate,
  setSelectedDate,
  errors,
  setErrors,
  bosses,
  isPvp,
  setIsPvp,
  isPvpLong,
  setIsPvpLong,
}: {
  users: any[];
  setUsers: (users: any[]) => void;
  category: string | null;
  setCategory: (value: string | null) => void;
  selectedBoss: string | null;
  setSelectedBoss: (value: string | null) => void;
  selectedBosses: {
    id: number;
    boss_name: string;
    category: string;
    dkp_points: number;
  }[];
  setSelectedBosses: React.Dispatch<
    React.SetStateAction<
      {
        id: number;
        boss_name: string;
        category: string;
        dkp_points: number;
      }[]
    >
  >;
  dkpPoints: number;
  setDkpPoints: (value: number) => void;
  selectedDate: Date | null;
  setSelectedDate: (value: Date | null) => void;
  errors: {
    category: boolean;
    selectedBoss: boolean;
    selectedDate: boolean;
  };
  setErrors: React.Dispatch<
    React.SetStateAction<{
      category: boolean;
      selectedBoss: boolean;
      selectedDate: boolean;
    }>
  >;
  bosses: {
    id: number;
    boss_name: string;
    dkp_points: number;
    category: string;
  }[];
  isPvp: boolean;
  setIsPvp: (val: boolean) => void;
  isPvpLong: boolean;
  setIsPvpLong: (val: boolean) => void;
}) {
  React.useEffect(() => {
    async function fetchUsers() {
      const activeUsers = await getActiveUsers();
      setUsers(activeUsers);
    }
    fetchUsers();
  }, [setUsers]);

  React.useEffect(() => {
    const total = eventDkpCalculator(selectedBosses, isPvp, isPvpLong);
    setDkpPoints(total);
  }, [selectedBosses, isPvp, isPvpLong]);

  const aglBossOrder = [
    "Гленн и Лорея",
    "Гленн и Лорея Прок",
    "Ашьяра",
    "Ашьяра Прок",
    "---", // разделитель
    "Морф",
    "Марли",
    "Марли Прок",
    "---", // разделитель
    "Кошка",
  ];

  return (
    <div className="space-y-4">
      <Label>Категория</Label>
      <Select
        onValueChange={(value) => {
          setCategory(value);
          setSelectedBoss(null);
          setSelectedBosses([]);
          setIsPvp(false);
          setIsPvpLong(false);
          setErrors((prev) => ({ ...prev, category: false }));
        }}
        value={category ?? undefined}
      >
        <SelectTrigger className="w-[270px]">
          <SelectValue placeholder="Выберите категорию события" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Прайм">Прайм</SelectItem>
          <SelectItem value="АГЛ">АГЛ</SelectItem>
        </SelectContent>
      </Select>
      {errors.category && (
        <p className="text-sm text-red-500">Обязательное поле</p>
      )}

      {category === "Прайм" && (
        <>
          <Label>Босс</Label>
          <Select
            onValueChange={(value) => {
              setSelectedBoss(value);
              setErrors((prev) => ({ ...prev, selectedBoss: false }));

              const boss = bosses.find((b) => b.boss_name === value);
              if (boss) {
                setSelectedBosses([boss]);
              } else {
                setSelectedBosses([]);
              }
            }}
          >
            <SelectTrigger className="w-[270px]">
              <SelectValue placeholder="Выберите босса" />
            </SelectTrigger>
            <SelectContent>
              {bosses
                .filter((boss) => boss.category === "Прайм")
                .map((boss) => (
                  <SelectItem key={boss.id} value={boss.boss_name}>
                    {boss.boss_name}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
          {errors.selectedBoss && (
            <p className="text-sm text-red-500">Обязательное поле</p>
          )}
        </>
      )}

      {category === "АГЛ" && (
        <>
          <Label>Боссы (можно выбрать нескольких)</Label>
          <DropdownMenu>
            <DropdownMenuTrigger className="border rounded px-4 py-2 text-left w-[270px]">
              {selectedBosses.length > 0
                ? selectedBosses.map((b) => b.boss_name).join(", ")
                : "Выберите боссов"}
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64 max-h-80 overflow-y-auto">
              {aglBossOrder.map((name, i) =>
                name === "---" ? (
                  <DropdownMenuSeparator key={`sep-${i}`} />
                ) : (
                  <DropdownMenuCheckboxItem
                    key={name}
                    onSelect={(event) => event.preventDefault()}
                    checked={selectedBosses.some((b) => b.boss_name === name)}
                    onCheckedChange={(checked) => {
                      const boss = bosses.find((b) => b.boss_name === name);
                      if (!boss) return;

                      setSelectedBosses((prev) =>
                        checked
                          ? [...prev, boss]
                          : prev.filter((b) => b.id !== boss.id)
                      );
                      setErrors((prev) => ({ ...prev, selectedBoss: false }));
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
      )}

      <div className="flex items-center space-x-2">
        <Checkbox
          id="pvp"
          checked={isPvp}
          disabled={isPvpLong}
          onCheckedChange={(checked) => {
            setIsPvp(checked === true);
            if (checked) setIsPvpLong(false); // Отключаем второй
          }}
        />
        <label htmlFor="pvp" className="text-sm">
          ПВП
        </label>
      </div>

      {category === "АГЛ" && (
        <div className="flex items-center space-x-2">
          <Checkbox
            id="long_pvp"
            checked={isPvpLong}
            disabled={isPvp} // блокируем, если выбран ПВП
            onCheckedChange={(checked) => {
              setIsPvpLong(checked === true);
              if (checked) setIsPvp(false); // Отключаем первый
            }}
          />
          <label htmlFor="long_pvp" className="text-sm">
            ПВП дольше 30 минут
          </label>
        </div>
      )}

      <div className="space-y-2">
        <Label>Дата и время (МСК)</Label>
        <DatetimePicker
          value={selectedDate}
          onChange={(date) => {
            setSelectedDate(date);
            setErrors((prev) => ({ ...prev, selectedDate: false }));
          }}
        />
        {errors.selectedDate && (
          <p className="text-sm text-red-500">Обязательное поле</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Ценность посещения</Label>
        <Input className="w-[270px]" disabled value={dkpPoints ?? 0} />
      </div>
    </div>
  );
}
