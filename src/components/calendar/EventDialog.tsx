// components/EventDialog.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { getBosses } from "@/src/actions/getBosses";
import createEvent from "@/src/actions/createRaidEvent";
import updateEvent from "@/src/actions/updateEvent";
import { RaidDetailsForm } from "./CreateEvent/components/RaidDetailsForm";
import { ScreenshotOcr } from "./CreateEvent/components/ScreenshotOcr";
import { SelectRaidList } from "./CreateEvent/components/SelectRaidList";
import { SelectedRaidList } from "./CreateEvent/components/SelectedRaidList";
import deleteEvent from "@/src/actions/deleteEvent";
import { DeleteEventButton } from "./CreateEvent/components/DeleteEventButton";

export function EventDialog({
  open,
  setOpen,
  mode,
  selectedEvent,
  onComplete,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  mode: "create" | "edit";
  selectedEvent: any;
  onComplete?: () => void;
}) {
  const [category, setCategory] = useState<string | null>(null);
  const [selectedBoss, setSelectedBoss] = useState<string | null>(null);
  const [selectedBosses, setSelectedBosses] = useState<any[]>([]);
  const [dkpPoints, setDkpPoints] = useState<number>(0);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isPvp, setIsPvp] = useState(false);
  const [isPvpLong, setIsPvpLong] = useState(false);
  const [rowSelection, setRowSelection] = useState<Record<number, boolean>>({});
  const [users, setUsers] = useState<any[]>([]);
  const [bosses, setBosses] = useState<any[]>([]);
  const [success, setSuccess] = useState<string | null>(null);
  const [errors, setErrors] = useState({
    category: false,
    selectedBoss: false,
    selectedDate: false,
  });

  const selectedUsers = users.filter((_, index) => rowSelection[index]);

  useEffect(() => {
    getBosses().then(setBosses);
  }, []);

  useEffect(() => {
    if (mode === "edit" && selectedEvent) {
      setCategory(selectedEvent.type || null);
      setSelectedDate(
        selectedEvent.start_date ? new Date(selectedEvent.start_date) : null
      );
      setIsPvp(selectedEvent.is_pvp);
      setIsPvpLong(selectedEvent.is_pvp_long);

      const bosses = selectedEvent.raidBosses?.map((rb: any) => rb.boss) || [];
      setSelectedBosses(bosses);

      if (selectedEvent.type === "Прайм" && bosses.length > 0) {
        setSelectedBoss(bosses[0].boss_name);
      }
    }
  }, [mode, selectedEvent]);

  useEffect(() => {
    if (mode === "edit" && selectedEvent && users.length > 0) {
      const selection: Record<number, boolean> = {};
      const selectedIds =
        selectedEvent.attendance?.map((a: any) => a.user_id) || [];

      selectedIds.forEach((id: number) => {
        const userIndex = users.findIndex((u) => u.id === id);
        if (userIndex !== -1) {
          selection[userIndex] = true;
        }
      });

      setRowSelection(selection);
    }
  }, [mode, selectedEvent, users]);

  useEffect(() => {
    if (mode === "create" && open) {
      setCategory(null);
      setSelectedBoss(null);
      setSelectedBosses([]);
      setDkpPoints(0);
      setSelectedDate(null);
      setIsPvp(false);
      setIsPvpLong(false);
      setRowSelection({});
      setUsers([]);
      setErrors({
        category: false,
        selectedBoss: false,
        selectedDate: false,
      });
    }
  }, [mode, open]);

  const handleSubmit = async () => {
    const newErrors = {
      category: !category,
      selectedBoss: selectedBosses.length === 0,
      selectedDate: !selectedDate,
    };
    setErrors(newErrors);

    const hasErrors = Object.values(newErrors).some(Boolean);
    if (hasErrors) return;

    const userIds = selectedUsers.map((u) => u.id);
    const bossIds = selectedBosses.map((b) => b.id);

    if (mode === "create") {
      await createEvent(
        category!,
        dkpPoints,
        selectedDate!,
        userIds,
        bossIds,
        isPvp,
        isPvpLong
      );
    } else if (mode === "edit" && selectedEvent) {
      await updateEvent(
        selectedEvent.id,
        category!,
        dkpPoints,
        selectedDate!,
        userIds,
        bossIds,
        isPvp,
        isPvpLong
      );
    }

    setSuccess(mode === "edit" ? "Обновлено!" : "Создано!");
    setOpen(false);
    if (onComplete) onComplete();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-7xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Редактировать активность" : "Новая активность"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit"
              ? "Измените детали события"
              : "Создайте новую активность гильдии"}
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

        <DialogFooter className="flex justify-between">
          {mode === "edit" && selectedEvent && (
            <DeleteEventButton
              eventId={selectedEvent.id}
              onSuccess={() => {
                setOpen(false);
                onComplete?.();
              }}
            />
          )}

          <Button onClick={handleSubmit} className="w-full cursor-pointer md:w-auto">
            {mode === "edit" ? "Изменить" : "Создать"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
