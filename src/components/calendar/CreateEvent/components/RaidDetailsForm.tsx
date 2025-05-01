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
}: {
  users: any[];
  setUsers: (users: any[]) => void;
}) {
  const [isPvp, setIsPvp] = React.useState(false);
  const [isLongPvp, setIsLongPvp] = React.useState(false);
  const [isProc, setIsProc] = React.useState(false);
  const [isDoubleProc, setIsDoubleProc] = React.useState(false);
  const [isMarliProc, setIsMarliProc] = React.useState(false);
  const [category, setCategory] = React.useState<string | null>(null);
  const [selectedBoss, setSelectedBoss] = React.useState<string | null>(null);

  const dkpPoints = React.useMemo(() => {
    return eventDkpCalculator(
      selectedBoss,
      isPvp,
      isLongPvp,
      isProc,
      isDoubleProc,
      isMarliProc
    );
  }, [selectedBoss, isPvp, isLongPvp, isProc, isDoubleProc, isMarliProc]);

  React.useEffect(() => {
    async function fetchUsers() {
      const activeUsers = await getActiveUsers();
      setUsers(activeUsers);
    }
    fetchUsers();
  }, [setUsers]);

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
        }}
      >
        <SelectTrigger className="w-[270px]">
          <SelectValue placeholder="Выберите категорию события" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="raid.type.prime">Прайм</SelectItem>
          <SelectItem value="raid.type.agl">АГЛ</SelectItem>
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
          >
            <SelectTrigger className="w-[270px]">
              <SelectValue placeholder="Выберите босса" />
            </SelectTrigger>
            <SelectContent>
              {category === "raid.type.agl" && (
                <>
                  <SelectItem value="raid.boss_name.agl">АГЛ</SelectItem>
                  <SelectItem value="raid.boss_name.koshka">Кошка</SelectItem>
                  <SelectSeparator />
                  <SelectItem value="raid.boss_name.morpheus">Морф</SelectItem>
                  <SelectItem value="raid.boss_name.marli">Марли</SelectItem>
                </>
              )}
              {category === "raid.type.prime" && (
                <>
                  <SelectItem value="raid.boss_name.ksanatos">
                    Ксанатос
                  </SelectItem>
                  <SelectItem value="raid.boss_name.kraken">Кракен</SelectItem>
                  <SelectItem value="raid.boss_name.kalidis">
                    Калидис
                  </SelectItem>
                  <SelectItem value="raid.boss_name.leviathan">
                    Левиафан
                  </SelectItem>
                  <SelectSeparator />
                  <SelectItem value="raid.boss_name.antallon">
                    Анталлон
                  </SelectItem>
                  <SelectItem value="raid.boss_name.kaleil">Калеиль</SelectItem>
                  <SelectItem value="raid.boss_name.korvus">Корвус</SelectItem>
                  <SelectSeparator />
                  <SelectItem value="raid.boss_name.delphie">
                    Дельфиец
                  </SelectItem>
                  <SelectItem value="raid.boss_name.siege">Осада</SelectItem>
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

      {category === "raid.type.agl" && (
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
          {(selectedBoss === "raid.boss_name.marli" ||
            selectedBoss === "raid.boss_name.agl") && (
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
          {selectedBoss === "raid.boss_name.agl" && (
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
          {selectedBoss === "raid.boss_name.morpheus" && (
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
        <DatetimePicker />
      </div>
      <div className="space-y-2">
        <Label>Ценность посещения</Label>
        <Input className="w-[270px]" disabled value={dkpPoints ?? 0} />
      </div>
    </div>
  );
}
