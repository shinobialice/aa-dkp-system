"use client";
import React from "react";
import CategorySelector from "./CategorySelector";
import BossSelector from "./BossSelector";
import DatetimePicker from "./DateTimePicker";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { getActiveUsers } from "@/src/actions/getActiveUsers";
import eventDkpCalculator from "@/src/utils/eventDkpCalculator";

export function RaidDetailsForm({
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
  selectedBosses: any[];
  setSelectedBosses: React.Dispatch<React.SetStateAction<any[]>>;
  dkpPoints: number;
  setDkpPoints: (value: number) => void;
  selectedDate: Date | null;
  setSelectedDate: (value: Date | null) => void;
  errors: any;
  setErrors: React.Dispatch<React.SetStateAction<any>>;
  bosses: any[];
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
    let dkp = 0;
    if (category === "АГЛ") {
      dkp = selectedBosses.reduce((sum, boss) => sum + (boss.dkp_points || 0), 0);
      if (isPvp) dkp += 2;
      else if (isPvpLong) dkp += 1;
    } else {
      dkp = eventDkpCalculator(selectedBosses[0], isPvp, isPvpLong);
    }
    setDkpPoints(dkp);
  }, [selectedBosses, isPvp, isPvpLong, category]);

  return (
    <div className="flex flex-col h-full space-y-4">
      <CategorySelector
        category={category}
        setCategory={setCategory}
        setSelectedBoss={setSelectedBoss}
        setSelectedBosses={setSelectedBosses}
        setIsPvp={setIsPvp}
        setIsPvpLong={setIsPvpLong}
        setErrors={setErrors}
        errors={errors}
      />
      <BossSelector
        category={category}
        bosses={bosses}
        selectedBoss={selectedBoss}
        setSelectedBoss={setSelectedBoss}
        selectedBosses={selectedBosses}
        setSelectedBosses={setSelectedBosses}
        setErrors={setErrors}
        errors={errors}
      />

      {category === "АГЛ" && (
        <div className="flex items-center space-x-2">
          <Checkbox
            className="cursor-pointer"
            id="long_pvp"
            checked={isPvpLong}
            disabled={isPvp}
            onCheckedChange={(checked) => {
              setIsPvpLong(checked === true);
              if (checked) {
                setIsPvp(false);
              }
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

      <div className="mt-auto space-y-2">
        <Label>Ценность посещения</Label>
        <Input className="w-[270px]" disabled value={dkpPoints ?? 0} />
      </div>
    </div>
  );
}
