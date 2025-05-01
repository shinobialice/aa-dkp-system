import React, { useEffect, useMemo, useState } from "react";
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
import { ScreenshotOcr } from "./components/ScreenshotOcr";
import { RaidDetailsForm } from "./components/RaidDetailsForm";
import { SelectRaidList } from "./components/SelectRaidList";
import { SelectedRaidList } from "./components/SelectedRaidList";
import { Separator } from "@/components/ui/separator";
import createRaidEvent from "@/src/actions/createRaidEvent";
import { getBosses } from "@/src/actions/getBosses";
import { eventDkpCalculator } from "@/src/utils/eventDkpCalculator";

export function CreateEvent({ onCreated }: { onCreated?: () => void }) {
  const [category, setCategory] = useState<string | null>(null);
  const [selectedBoss, setSelectedBoss] = useState<string | null>(null);
  const [dkpPoints, setDkpPoints] = useState(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [bosses, setBosses] = useState<
    { id: number; boss_name: string; dkp_points: number; category: string }[]
  >([]);
  const [selectedBosses, setSelectedBosses] = useState<
    { id: number; boss_name: string; category: string; dkp_points: number }[]
  >([]);
  const [isPvp, setIsPvp] = useState(false);
  const [isPvpLong, setIsPvpLong] = useState(false);

  const [errors, setErrors] = useState({
    category: false,
    selectedBoss: false,
    selectedDate: false,
  });
  const [open, setOpen] = useState(false);

  const [rowSelection, setRowSelection] = useState<Record<number, boolean>>({});
  const [users, setUsers] = useState<any[]>([]);

  const activeUsers = useMemo(() => users.filter((u) => u.active), [users]);
  const selectedUsers = useMemo(
    () => activeUsers.filter((_, index) => rowSelection[index]),
    [activeUsers, rowSelection]
  );

  useEffect(() => {
    getBosses().then(setBosses);
  }, []);

  useEffect(() => {
    const summary = eventDkpCalculator(selectedBosses, isPvp, isPvpLong);
    setDkpPoints(summary);
  }, [selectedBosses, isPvp, isPvpLong]);

  const handleCreateEvent = async () => {
    const isBossSelected =
      category === "Прайм" ? !!selectedBoss : selectedBosses.length > 0;

    const newErrors = {
      category: !category,
      selectedBoss: !isBossSelected,
      selectedDate: !selectedDate,
    };
    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some(Boolean);
    if (hasErrors) return;

    const userIds = selectedUsers.map((u) => u.id);

    await createRaidEvent(
      category as string,
      dkpPoints,
      selectedDate as Date,
      userIds,
      selectedBosses.map((b) => b.id),
      isPvp,
      isPvpLong
    );
    setCategory(null);
    setSelectedBoss(null);
    setSelectedBosses([]);
    setDkpPoints(0);
    setSelectedDate(null);
    setIsPvp(false);
    setIsPvpLong(false);
    setRowSelection({});
    setOpen(false);
    onCreated?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Добавить Активность</Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl">
        <DialogHeader>
          <DialogTitle>Новая активность</DialogTitle>
          <DialogDescription>
            Создать новую активность гильдии
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:border-r md:pr-4">
            <RaidDetailsForm
              users={users}
              setUsers={setUsers}
              category={category}
              setCategory={setCategory}
              selectedBoss={selectedBoss}
              setSelectedBoss={setSelectedBoss}
              selectedBosses={selectedBosses}
              setSelectedBosses={setSelectedBosses}
              dkpPoints={dkpPoints}
              setDkpPoints={setDkpPoints}
              selectedDate={selectedDate}
              setSelectedDate={setSelectedDate}
              errors={errors}
              setErrors={setErrors}
              bosses={bosses}
              isPvp={isPvp}
              setIsPvp={setIsPvp}
              isPvpLong={isPvpLong}
              setIsPvpLong={setIsPvpLong}
            />
          </div>
          <div className="md:border-r md:pr-4">
            <ScreenshotOcr users={users} setRowSelection={setRowSelection} />
          </div>
          <div className="md:border-r md:pr-4">
            <SelectRaidList
              users={users}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
            />
          </div>
          <div>
            <SelectedRaidList users={selectedUsers} />
          </div>
        </div>
        <Separator />
        <DialogFooter>
          <Button onClick={handleCreateEvent} className="w-full md:w-auto">
            Создать
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
