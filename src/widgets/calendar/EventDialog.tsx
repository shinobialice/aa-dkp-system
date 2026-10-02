"use client";

import { useEffect, useMemo, useState } from "react";
import { Loader2 } from "lucide-react";
import { DeleteEventButton } from "./CreateEvent/components/DeleteEventButton";
import { RaidDetailsForm } from "./CreateEvent/components/RaidDetailsForm";
import ParticipantsPicker, {
  type PickerUser,
} from "./CreateEvent/components/ParticipantsPicker";
import { Button } from "@/shared/ui";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui";
import { cn } from "@/shared/lib/tw-merge";
import createEvent from "@/actions/createRaidEvent";
import { getBosses } from "@/actions/getBosses";
import updateEvent from "@/actions/updateEvent";
import { linkLootToRaid } from "@/actions/linkLootToRaid";
import { parseMoscowISOString } from "@/utils/getMoscowISOString";

function participantsLabel(n: number) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return `${n} участник`;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) {
    return `${n} участника`;
  }
  return `${n} участников`;
}

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
  const [activeBonusIds, setActiveBonusIds] = useState<Record<number, boolean>>(
    {},
  );
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

  const [step, setStep] = useState<"raid" | "people">("raid");

  const allUsers = useMemo<PickerUser[]>(() => {
    if (mode !== "edit" || !selectedEvent || users.length === 0) return users;
    const known = new Set(users.map((user) => user.id));
    const extra = (selectedEvent.raid_attendance ?? [])
      .map((row: any) => row.user)
      .filter((user: any) => user && !known.has(user.id))
      .map((user: any) => ({
        id: user.id,
        username: user.username,
        class: user.class ?? null,
        joined_at: user.joined_at ?? null,
        inactive: true,
      }));
    return extra.length > 0 ? [...users, ...extra] : users;
  }, [mode, selectedEvent, users]);

  const selectedUsers = allUsers.filter((_, index) => rowSelection[index]);
  const hasErrors = Object.values(errors).some(Boolean);

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) setStep("raid");
  };

  useEffect(() => {
    getBosses(selectedDate ?? undefined).then(setBosses);
  }, [selectedDate]);

  useEffect(() => {
    if (mode === "edit" && selectedEvent) {
      setLootLinkIds({});
      setCategory(selectedEvent.type || null);
      setSelectedDate(
        selectedEvent.start_date
          ? parseMoscowISOString(selectedEvent.start_date)
          : null,
      );
      const bonusIds: Record<number, boolean> = {};
      (selectedEvent.bonusTypeIds ?? []).forEach((id: number) => {
        bonusIds[id] = true;
      });
      setActiveBonusIds(bonusIds);

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
    if (mode === "edit" && selectedEvent && allUsers.length > 0) {
      const selection: Record<number, boolean> = {};
      const attendance = selectedEvent.raid_attendance || [];

      attendance.forEach((a: any) => {
        const userIndex = allUsers.findIndex((u) => u.id === a.user.id);
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
  }, [mode, selectedEvent, allUsers]);

  useEffect(() => {
    if (mode === "create" && open) {
      setCategory(null);
      setSelectedBoss(null);
      setSelectedBosses([]);
      setDkpPoints(0);
      setSelectedDate(null);
      setActiveBonusIds({});
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

    if (Object.values(newErrors).some(Boolean)) {
      setStep("raid");
      return;
    }

    const userIds = selectedUsers.map((u) => u.id);
    const bossIds = selectedBosses.map((b) => b.id);
    const bonusTypeIds = Object.entries(activeBonusIds)
      .filter(([, checked]) => checked)
      .map(([id]) => Number(id));
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
          bonusTypeIds,
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
          bonusTypeIds,
          lateIds,
        );
        if (lootIdsToLink.length > 0) {
          await linkLootToRaid(lootIdsToLink, selectedEvent.id);
        }
      }

      setSuccess(mode === "edit" ? "Обновлено!" : "Создано!");
      handleOpenChange(false);
      if (onComplete) {
        onComplete();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const raidLabel = [
    selectedBosses.map((boss) => boss.boss_name).join(", "),
    selectedDate
      ? selectedDate.toLocaleString("ru-RU", {
          weekday: "long",
          day: "numeric",
          month: "long",
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "Europe/Moscow",
        })
      : "",
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="flex h-[100dvh] max-h-[100dvh] w-full max-w-none flex-col gap-0 overflow-hidden rounded-none p-0 sm:h-[min(860px,92dvh)] sm:max-w-6xl sm:rounded-2xl">
        <DialogHeader className="shrink-0 gap-0.5 border-b px-5 py-3.5 pr-12 text-left">
          <DialogTitle className="text-lg">
            {mode === "edit" ? "Редактировать посещение" : "Новое посещение"}
          </DialogTitle>
          <DialogDescription className="text-sm">
            {raidLabel ||
              (mode === "edit"
                ? "Измените детали рейда и участников"
                : "Выберите босса, время и отметьте участников")}
          </DialogDescription>
        </DialogHeader>

        <div
          role="tablist"
          className="mx-4 mt-3 grid shrink-0 grid-cols-2 gap-0.5 rounded-lg bg-muted p-[3px] md:hidden"
        >
          {(
            [
              ["raid", "Рейд"],
              ["people", `Участники ${selectedUsers.length}`],
            ] as const
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={step === key}
              onClick={() => setStep(key)}
              className={cn(
                "h-9 cursor-pointer rounded-md text-sm font-semibold transition-colors",
                step === key
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground",
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="grid min-h-0 flex-1 md:grid-cols-[340px_minmax(0,1fr)]">
          <div
            className={cn(
              "min-h-0 overflow-y-auto px-4 py-4 [scrollbar-width:thin] md:block md:border-r md:px-5",
              step === "raid" ? "block" : "hidden",
            )}
          >
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
              activeBonusIds={activeBonusIds}
              setActiveBonusIds={setActiveBonusIds}
              loot={mode === "edit" ? selectedEvent?.loot : undefined}
              lootLinkIds={lootLinkIds}
              setLootLinkIds={setLootLinkIds}
            />
          </div>
          <div
            className={cn(
              "min-h-0 flex-col px-4 py-4 md:flex md:px-5",
              step === "people" ? "flex" : "hidden",
            )}
          >
            <ParticipantsPicker
              users={allUsers}
              rowSelection={rowSelection}
              setRowSelection={setRowSelection}
              lateUserIds={lateUserIds}
              setLateUserIds={setLateUserIds}
            />
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 border-t bg-muted/40 px-4 py-3 md:px-5">
          {mode === "edit" && selectedEvent && (
            <DeleteEventButton
              eventId={selectedEvent.id}
              onSuccess={() => {
                handleOpenChange(false);
                onComplete?.();
              }}
            />
          )}
          {hasErrors && (
            <span className="text-[13px] text-destructive">
              Заполните тип, босса и время
            </span>
          )}
          <Button
            variant="outline"
            onClick={() => handleOpenChange(false)}
            className="ml-auto hidden cursor-pointer sm:inline-flex"
          >
            Отмена
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="h-11 flex-1 cursor-pointer sm:h-9 sm:flex-none"
          >
            {submitting && <Loader2 className="animate-spin" />}
            {mode === "edit" ? "Сохранить" : "Создать"} ·{" "}
            {participantsLabel(selectedUsers.length)}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
