"use client";
import React from "react";
import CategorySelector from "./CategorySelector";
import BossSelector from "./BossSelector";
import DatetimePicker from "./DateTimePicker";
import { Checkbox } from "@/shared/ui";
import { Label } from "@/shared/ui";
import { Input } from "@/shared/ui";
import { getActiveUsers } from "@/actions/getActiveUsers";
import { getAttendanceBonusSettings } from "@/actions/attendanceBonusSettings";
import {
  DEFAULT_ATTENDANCE_BONUS_SETTINGS,
  type AttendanceBonusSettings,
} from "@/utils/attendanceBonusDefaults";
import eventDkpCalculator from "@/utils/eventDkpCalculator";

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
  isProc,
  setIsProc,
  isDoubleProc,
  setIsDoubleProc,
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
  isProc: boolean;
  setIsProc: (val: boolean) => void;
  isDoubleProc: boolean;
  setIsDoubleProc: (val: boolean) => void;
}) {
  const [bonus, setBonus] = React.useState<AttendanceBonusSettings | null>(
    null,
  );

  React.useEffect(() => {
    async function fetchUsers() {
      const activeUsers = await getActiveUsers();
      setUsers(activeUsers);
    }
    fetchUsers();
  }, [setUsers]);

  React.useEffect(() => {
    getAttendanceBonusSettings()
      .then(setBonus)
      .catch(() => setBonus(DEFAULT_ATTENDANCE_BONUS_SETTINGS));
  }, []);

  React.useEffect(() => {
    if (!bonus) return;
    let dkp = 0;
    if (category === "АГЛ") {
      dkp = selectedBosses.reduce(
        (sum, boss) => sum + (boss.dkp_points || 0),
        0,
      );
      if (isPvp) dkp += bonus.pvpPoints;
      else if (isPvpLong) dkp += bonus.pvpLongPoints;
      if (isProc) dkp += bonus.procPoints;
      if (isDoubleProc) dkp += bonus.doubleProcPoints;
    } else {
      dkp = eventDkpCalculator(selectedBosses[0], isPvp, isPvpLong, bonus);
    }
    setDkpPoints(dkp);
  }, [selectedBosses, isPvp, isPvpLong, isProc, isDoubleProc, category, bonus]);

  // Прок/х2 Прок относятся только к обычному АГЛ — для Морфа, Марли Прока
  // и Кошки этих чекбоксов нет. Сбрасываем их только когда босса меняет
  // сам пользователь (см. handleSelectBoss) — НЕ через эффект на
  // selectedBoss, иначе это срабатывало бы и при загрузке старого рейда в
  // режиме редактирования, тихо обнуляя уже сохранённый исторический бонус
  // ещё до того, как админ вообще коснулся формы.
  const handleSelectBoss = (boss: any) => {
    setSelectedBoss(boss.boss_name);
    setSelectedBosses([boss]);
    setErrors((prev: any) => ({ ...prev, selectedBoss: false }));
    if (category === "АГЛ" && boss.boss_name !== "АГЛ") {
      setIsProc(false);
      setIsDoubleProc(false);
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      <CategorySelector
        category={category}
        setCategory={setCategory}
        setSelectedBoss={setSelectedBoss}
        setSelectedBosses={setSelectedBosses}
        setIsPvp={setIsPvp}
        setIsPvpLong={setIsPvpLong}
        setIsProc={setIsProc}
        setIsDoubleProc={setIsDoubleProc}
        setErrors={setErrors}
        errors={errors}
      />
      <BossSelector
        category={category}
        bosses={bosses}
        selectedBoss={selectedBoss}
        onSelectBoss={handleSelectBoss}
        errors={errors}
      />

      {category === "АГЛ" && (
        <>
          <div className="flex items-center space-x-2">
            <Checkbox
              className="cursor-pointer"
              id="pvp_agl"
              checked={isPvp}
              disabled={isPvpLong}
              onCheckedChange={(checked) => {
                setIsPvp(checked === true);
                if (checked) {
                  setIsPvpLong(false);
                }
              }}
            />
            <label htmlFor="pvp_agl" className="text-sm">
              ПВП
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              className="cursor-pointer"
              id="long_pvp_agl"
              checked={isPvpLong}
              disabled={isPvp}
              onCheckedChange={(checked) => {
                setIsPvpLong(checked === true);
                if (checked) {
                  setIsPvp(false);
                }
              }}
            />
            <label htmlFor="long_pvp_agl" className="text-sm">
              ПВП дольше 30 минут
            </label>
          </div>
          {selectedBoss === "АГЛ" && (
            <>
              <div className="flex items-center space-x-2">
                <Checkbox
                  className="cursor-pointer"
                  id="proc_agl"
                  checked={isProc}
                  onCheckedChange={(checked) => setIsProc(checked === true)}
                />
                <label htmlFor="proc_agl" className="text-sm">
                  Прок
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  className="cursor-pointer"
                  id="double_proc_agl"
                  checked={isDoubleProc}
                  onCheckedChange={(checked) =>
                    setIsDoubleProc(checked === true)
                  }
                />
                <label htmlFor="double_proc_agl" className="text-sm">
                  х2 Прок
                </label>
              </div>
            </>
          )}
        </>
      )}

      {category === "Прайм" && (
        <div className="flex items-center space-x-2">
          <Checkbox
            className="cursor-pointer"
            id="pvp_prime"
            checked={isPvp}
            onCheckedChange={(checked) => {
              setIsPvp(checked === true);
            }}
          />
          <label htmlFor="pvp_prime" className="text-sm">
            ПВП
          </label>
        </div>
      )}
      <div className="space-y-2">
        <Label>Дата и время (МСК)</Label>
        <DatetimePicker
          value={selectedDate}
          onChange={(date) => {
            setSelectedDate(date);
            setErrors((prev: any) => ({ ...prev, selectedDate: false }));
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
