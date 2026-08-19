"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { DeleteEventButton } from "./CreateEvent/components/DeleteEventButton";
import { RaidDetailsForm } from "./CreateEvent/components/RaidDetailsForm";
import { ScreenshotOcr } from "./CreateEvent/components/ScreenshotOcr";
import { SelectedRaidList } from "./CreateEvent/components/SelectedRaidList";
import { SelectRaidList } from "./CreateEvent/components/SelectRaidList";
import { Button } from "@/shared/ui";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/ui";
import { Separator } from "@/shared/ui";
import createEvent from "@/actions/createRaidEvent";
import { getBosses } from "@/actions/getBosses";
import updateEvent from "@/actions/updateEvent";
import { linkLootToRaid } from "@/actions/linkLootToRaid";
import { parseMoscowISOString } from "@/utils/getMoscowISOString";

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
  const [isProc, setIsProc] = useState(false);
  const [isDoubleProc, setIsDoubleProc] = useState(false);
  const [rowSelection, setRowSelection] = useState<Record<number, boolean>>({});
  const [lateUserIds, setLateUserIds] = useState<Record<number, boolean>>({});
  const [lootLinkIds, setLootLinkIds] = useState<Record<number, boolean>>({});
  const [users, setUsers] = useState<any[]>([]);
  const [bosses, setBosses] = useState<any[]>([]);
  const [, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
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
      setLootLinkIds({});
      setCategory(selectedEvent.type || null);
      setSelectedDate(
        selectedEvent.start_date
          ? parseMoscowISOString(selectedEvent.start_date)
          : null,
      );
      setIsPvp(selectedEvent.is_pvp);
      setIsPvpLong(selectedEvent.is_pvp_long);
      setIsProc(selectedEvent.is_proc ?? false);
      setIsDoubleProc(selectedEvent.is_double_proc ?? false);

      const bosses = selectedEvent.raid_boss?.map((rb: any) => rb.boss) || [];
      setSelectedBosses(bosses);

      if (
        (selectedEvent.type === "Прайм" || selectedEvent.type === "АГЛ") &&
        bosses.length > 0
      ) {
        setSelectedBoss(bosses[0].boss_name);
      }
    }
  }, [mode, selectedEvent]);

  useEffect(() => {
    if (mode === "edit" && selectedEvent && users.length > 0) {
      const selection: Record<number, boolean> = {};
      const attendance = selectedEvent.raid_attendance || [];

      attendance.forEach((a: any) => {
        const userIndex = users.findIndex((u) => u.id === a.user.id);
        if (userIndex !== -1) {
          selection[userIndex] = true;
        }
      });

      setRowSelection(selection);

      const late: Record<number, boolean> = {};
      attendance.forEach((a: any) => {
        if (a.is_late) late[a.user.id] = true;
      });
      setLateUserIds(late);
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
      setIsProc(false);
      setIsDoubleProc(false);
      setRowSelection({});
      setLateUserIds({});
      setLootLinkIds({});
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
    if (hasErrors) {
      return;
    }

    const userIds = selectedUsers.map((u) => u.id);
    const bossIds = selectedBosses.map((b) => b.id);
    const lateIds = userIds.filter((id) => lateUserIds[id]);
    const lootIdsToLink = Object.entries(lootLinkIds)
      .filter(([, checked]) => checked)
      .map(([id]) => Number(id));

    setSubmitting(true);
    try {
      if (mode === "create") {
        const raid = await createEvent(
          category!,
          dkpPoints,
          selectedDate!,
          userIds,
          bossIds,
          isPvp,
          isPvpLong,
          isProc,
          isDoubleProc,
          lateIds,
        );
        if (lootIdsToLink.length > 0) {
          await linkLootToRaid(lootIdsToLink, raid.id);
        }
      } else if (mode === "edit" && selectedEvent) {
        await updateEvent(
          selectedEvent.id,
          category!,
          dkpPoints,
          selectedDate!,
          userIds,
          bossIds,
          isPvp,
          isPvpLong,
          isProc,
          isDoubleProc,
          lateIds,
        );
        if (lootIdsToLink.length > 0) {
          await linkLootToRaid(lootIdsToLink, selectedEvent.id);
        }
      }

      setSuccess(mode === "edit" ? "Обновлено!" : "Создано!");
      setOpen(false);
      if (onComplete) {
        onComplete();
      }
    } finally {
      setSubmitting(false);
    }
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
              mode={mode}
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
              isProc={isProc}
              setIsProc={setIsProc}
              isDoubleProc={isDoubleProc}
              setIsDoubleProc={setIsDoubleProc}
              loot={mode === "edit" ? selectedEvent?.loot : undefined}
              lootLinkIds={lootLinkIds}
              setLootLinkIds={setLootLinkIds}
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
            <SelectedRaidList
              users={selectedUsers}
              lateUserIds={lateUserIds}
              setLateUserIds={setLateUserIds}
            />
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

          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full cursor-pointer md:w-auto"
          >
            {submitting && <Loader2 className="mr-2 size-4 animate-spin" />}
            {mode === "edit" ? "Изменить" : "Создать"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
