import * as React from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectSeparator,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { eventDkpCalculator } from "@/src/utils/eventDkpCalculator";
import { getActiveUsers } from "@/src/actions/getActiveUsers";
import DatetimePicker from "./DateTimePicker";

export function RaidDetailsForm({
  users,
  setUsers,
  category,
  setCategory,
  selectedBoss,
  setSelectedBoss,
  dkpPoints,
  setDkpPoints,
  selectedDate,
  setSelectedDate,
}: {
  users: any[];
  setUsers: (users: any[]) => void;
  category: string | null;
  setCategory: (value: string | null) => void;
  selectedBoss: string | null;
  setSelectedBoss: (value: string | null) => void;
  dkpPoints: number;
  setDkpPoints: (value: number) => void;
  selectedDate: Date | null;
  setSelectedDate: (value: Date | null) => void;
}) {
  const [isPvp, setIsPvp] = React.useState(false);
  const [isLongPvp, setIsLongPvp] = React.useState(false);
  const [isProc, setIsProc] = React.useState(false);
  const [isDoubleProc, setIsDoubleProc] = React.useState(false);
  const [isMarliProc, setIsMarliProc] = React.useState(false);

  React.useEffect(() => {
    async function fetchUsers() {
      const activeUsers = await getActiveUsers();
      setUsers(activeUsers);
    }
    fetchUsers();
  }, [setUsers]);

  React.useEffect(() => {
    const calculated = eventDkpCalculator(
      selectedBoss,
      isPvp,
      isLongPvp,
      isProc,
      isDoubleProc,
      isMarliProc
    );
    setDkpPoints(calculated);
  }, [
    selectedBoss,
    isPvp,
    isLongPvp,
    isProc,
    isDoubleProc,
    isMarliProc,
    setDkpPoints,
  ]);

  return (
    <div className="space-y-4">
      <Label>Категория</Label>
      <Select
        onValueChange={(value) => {
          setCategory(value);
          setSelectedBoss(null);
          setIsPvp(false);
          setIsLongPvp(false);
          setIsProc(false);
          setIsDoubleProc(false);
          setIsMarliProc(false);
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

      {category && (
        <>
          <Label>Босс</Label>
          <Select
            onValueChange={(value) => {
              setSelectedBoss(value);
              setIsPvp(false);
              setIsLongPvp(false);
              setIsProc(false);
              setIsDoubleProc(false);
              setIsMarliProc(false);
            }}
            value={selectedBoss ?? undefined}
          >
            <SelectTrigger className="w-[270px]">
              <SelectValue placeholder="Выберите босса" />
            </SelectTrigger>
            <SelectContent>
              {category === "АГЛ" && (
                <>
                  <SelectItem value="АГЛ">АГЛ</SelectItem>
                  <SelectItem value="Разъяренная Сехекмет">
                    Разъяренная Сехекмет
                  </SelectItem>
                  <SelectSeparator />
                  <SelectItem value="Морфеос">Морфеос</SelectItem>
                  <SelectItem value="Марли">Марли</SelectItem>
                </>
              )}
              {category === "Прайм" && (
                <>
                  <SelectItem value="Ксанатос">Ксанатос</SelectItem>
                  <SelectItem value="Кракен">Кракен</SelectItem>
                  <SelectItem value="Калидис">Калидис</SelectItem>
                  <SelectItem value="Левиафан">Левиафан</SelectItem>
                  <SelectSeparator />
                  <SelectItem value="Анталлон">Анталлон</SelectItem>
                  <SelectItem value="Калеиль">Калеиль</SelectItem>
                  <SelectItem value="Корвус">Корвус</SelectItem>
                  <SelectSeparator />
                  <SelectItem value="Дельфиец">Дельфиец</SelectItem>
                  <SelectItem value="Осада">Осада</SelectItem>
                </>
              )}
            </SelectContent>
          </Select>
        </>
      )}

      <div className="flex items-center space-x-2">
        <Checkbox
          id="pvp"
          checked={isPvp}
          onCheckedChange={(checked) => setIsPvp(checked === true)}
        />
        <label htmlFor="pvp" className="text-sm">
          ПВП
        </label>
      </div>

      {category === "АГЛ" && (
        <>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="long_pvp"
              checked={isLongPvp}
              onCheckedChange={(checked) => setIsLongPvp(checked === true)}
            />
            <label htmlFor="long_pvp" className="text-sm">
              ПВП дольше 30 минут
            </label>
          </div>
          {(selectedBoss === "Марли" || selectedBoss === "АГЛ") && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="proc"
                checked={isProc}
                onCheckedChange={(checked) => setIsProc(checked === true)}
              />
              <label htmlFor="proc" className="text-sm">
                Прок
              </label>
            </div>
          )}
          {selectedBoss === "АГЛ" && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="double_proc"
                checked={isDoubleProc}
                onCheckedChange={(checked) => setIsDoubleProc(checked === true)}
              />
              <label htmlFor="double_proc" className="text-sm">
                х2 Прок
              </label>
            </div>
          )}
          {selectedBoss === "Морфеос" && (
            <div className="flex items-center space-x-2">
              <Checkbox
                id="marli_proc"
                checked={isMarliProc}
                onCheckedChange={(checked) => setIsMarliProc(checked === true)}
              />
              <label htmlFor="marli_proc" className="text-sm">
                Марли прок
              </label>
            </div>
          )}
        </>
      )}

      <div className="space-y-2">
        <Label>Дата и время (МСК)</Label>
        <DatetimePicker value={selectedDate} onChange={setSelectedDate} />
      </div>
      <div className="space-y-2">
        <Label>Ценность посещения</Label>
        <Input className="w-[270px]" disabled value={dkpPoints ?? 0} />
      </div>
    </div>
  );
}
