import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectSeparator,
} from "@/components/ui/select";
import DatetimePicker from "./DateTimePicker";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { SelectRaidList } from "./SelectRaidList";
import { getActiveUsers } from "@/src/actions/getActiveUsers";
import { SelectedRaidList } from "./SelectedRaidList";
import { eventDkpCalculator } from "@/src/utils/eventDkpCalculator";

export function CreateEvent() {
  const [isPvp, setIsPvp] = React.useState(false);
  const [isLongPvp, setIsLongPvp] = React.useState(false);
  const [isProc, setIsProc] = React.useState(false);
  const [category, setCategory] = React.useState<string | null>(null);
  const [selectedBoss, setSelectedBoss] = React.useState<string | null>(null);
  const [isDoubleProc, setIsDoubleProc] = React.useState(false);
  const [users, setUsers] = React.useState<any[]>([]);
  const dkpPoints = React.useMemo(() => {
    return eventDkpCalculator(
      selectedBoss,
      isPvp,
      isLongPvp,
      isProc,
      isDoubleProc
    );
  }, [selectedBoss, isPvp, isLongPvp, isProc, isDoubleProc]);
  const [rowSelection, setRowSelection] = React.useState<
    Record<number, boolean>
  >({});

  const activeUsers = React.useMemo(
    () => users.filter((u) => u.active),
    [users]
  );

  const selectedUsers = React.useMemo(() => {
    return activeUsers.filter((_, index) => rowSelection[index]);
  }, [activeUsers, rowSelection]);

  React.useEffect(() => {
    async function fetchUsers() {
      const activeUsers = await getActiveUsers();
      setUsers(activeUsers);
    }
    fetchUsers();
  }, []);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Добавить Активность</Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Новая активность</DialogTitle>
          <DialogDescription>
            Создать новую активность гильдии
          </DialogDescription>
        </DialogHeader>

        <div className="flex grid-cols-3 gap-4 max-md:flex-col">
          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Категория</Label>
                <Select
                  onValueChange={(value) => {
                    setCategory(value);
                    setSelectedBoss(null); // сбросить босса при смене категории
                    setIsPvp(false); // сбросить чекбоксы
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
              </div>
            </div>

            {category === "raid.type.agl" && (
              <div className="space-y-2">
                <Label>Босс</Label>
                <Select onValueChange={setSelectedBoss}>
                  <SelectTrigger className="w-[270px]">
                    <SelectValue placeholder="Выберите босса" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="raid.boss_name.agl">АГЛ</SelectItem>
                    <SelectItem value="raid.boss_name.koshka">Кошка</SelectItem>
                    <SelectSeparator />
                    <SelectItem value="raid.boss_name.marli">Марли</SelectItem>
                    <SelectItem value="raid.boss_name.morpheus">
                      Морф
                    </SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center space-x-2 py-2">
                  <Checkbox
                    id="pvp"
                    checked={isPvp}
                    onCheckedChange={(checked) => setIsPvp(checked === true)}
                  />
                  <label htmlFor="pvp" className="text-sm font-medium">
                    ПВП
                  </label>
                </div>

                <div className="flex items-center space-x-2 py-2">
                  <Checkbox
                    id="long_pvp"
                    checked={isLongPvp}
                    onCheckedChange={(checked) =>
                      setIsLongPvp(checked === true)
                    }
                  />
                  <label htmlFor="long_pvp" className="text-sm font-medium">
                    ПВП дольше 30 минут
                  </label>
                </div>

                {(selectedBoss === "raid.boss_name.marli" ||
                  selectedBoss === "raid.boss_name.agl") && (
                  <div className="flex items-center space-x-2 py-2">
                    <Checkbox
                      id="procedure"
                      checked={isProc}
                      onCheckedChange={(checked) => setIsProc(checked === true)}
                    />
                    <label htmlFor="procedure" className="text-sm font-medium">
                      Прок
                    </label>
                  </div>
                )}
                {selectedBoss === "raid.boss_name.agl" && (
                  <div className="flex items-center space-x-2 py-2">
                    <Checkbox
                      id="double_procedure"
                      checked={isDoubleProc}
                      onCheckedChange={(checked) =>
                        setIsDoubleProc(checked === true)
                      }
                    />
                    <label
                      htmlFor="double_procedure"
                      className="text-sm font-medium"
                    >
                      х2 Прок
                    </label>
                  </div>
                )}
              </div>
            )}

            {category === "raid.type.prime" && (
              <div className="space-y-2">
                <Label>Босс</Label>
                <Select onValueChange={setSelectedBoss}>
                  <SelectTrigger className="w-[270px]">
                    <SelectValue placeholder="Выберите босса" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="raid.boss_name.ksanatos">
                      Ксанатос
                    </SelectItem>
                    <SelectItem value="raid.boss_name.kraken">
                      Кракен
                    </SelectItem>
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
                    <SelectItem value="raid.boss_name.kaleil">
                      Калеиль
                    </SelectItem>
                    <SelectItem value="raid.boss_name.korvus">
                      Корвус
                    </SelectItem>
                    <SelectSeparator />
                    <SelectItem value="raid.boss_name.delphie">
                      Дельфиец
                    </SelectItem>
                    <SelectItem value="raid.boss_name.siege">Осада</SelectItem>
                  </SelectContent>
                </Select>

                <div className="flex items-center space-x-2 py-4">
                  <Checkbox
                    id="pvp"
                    checked={isPvp}
                    onCheckedChange={(checked) => setIsPvp(checked === true)}
                  />
                  <label htmlFor="terms" className="text-sm font-medium">
                    ПВП
                  </label>
                </div>
              </div>
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
          <div className="md:w-1/3">
            {" "}
            <SelectRaidList
              users={users}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
            ></SelectRaidList>
          </div>
          <div className="md:w-1/3">
            <SelectedRaidList users={selectedUsers}></SelectedRaidList>
          </div>
        </div>

        <DialogFooter>
          <Button type="submit" className="w-full md:w-auto">
            Создать
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
