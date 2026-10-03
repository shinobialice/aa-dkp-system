"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { RaidDetails } from "@/actions/getRaidById";
import { cn } from "@/shared/lib/tw-merge";
import { DialogDescription, DialogHeader, DialogTitle } from "@/shared/ui";
import EventFormFooter from "./EventFormFooter";
import EventFormSteps, { type EventFormStep } from "./EventFormSteps";
import { raidLabel, type EventFormMode } from "./eventFormModel";
import ParticipantsPicker from "./ParticipantsPicker";
import RaidDetailsForm from "./RaidDetailsForm";
import { useEventForm } from "./useEventForm";
import { errorMessage } from "@/shared/lib/errorMessage";

type Props = {
  mode: EventFormMode;
  event: RaidDetails | null;
  onClose: () => void;
  onComplete?: () => void;
};

export default function EventForm({ mode, event, onClose, onComplete }: Props) {
  const form = useEventForm(mode, event);
  const [step, setStep] = useState<EventFormStep>("raid");

  const isEdit = mode === "edit";
  const title = isEdit ? "Редактировать посещение" : "Новое посещение";
  const hint = isEdit
    ? "Измените детали рейда и участников"
    : "Выберите босса, время и отметьте участников";
  const description = raidLabel(form.draft.bosses, form.draft.date) || hint;

  const handleDone = () => {
    onClose();
    onComplete?.();
  };

  const handleSubmit = async () => {
    try {
      const saved = await form.submit();
      if (saved) handleDone();
      else setStep("raid");
    } catch (error) {
      toast.error(errorMessage(error, "Не удалось сохранить рейд"));
    }
  };

  return (
    <>
      <DialogHeader className="shrink-0 gap-0.5 border-b px-5 py-3.5 pr-12 text-left">
        <DialogTitle className="text-lg">{title}</DialogTitle>
        <DialogDescription className="text-sm">{description}</DialogDescription>
      </DialogHeader>

      <EventFormSteps
        step={step}
        participantCount={form.selectedUsers.length}
        onStepChange={setStep}
      />

      <div className="grid min-h-0 flex-1 md:grid-cols-[340px_minmax(0,1fr)]">
        <div
          className={cn(
            "min-h-0 overflow-y-auto px-4 py-4 [scrollbar-width:thin] md:block md:border-r md:px-5",
            step === "raid" ? "block" : "hidden",
          )}
        >
          <RaidDetailsForm form={form} />
        </div>
        <div
          className={cn(
            "min-h-0 flex-col px-4 py-4 md:flex md:px-5",
            step === "people" ? "flex" : "hidden",
          )}
        >
          <ParticipantsPicker
            users={form.users}
            selectedIds={form.draft.participantIds}
            lateIds={form.draft.lateIds}
            onSelectionChange={form.setParticipants}
            onLateToggle={(id) => form.toggleFlag("lateIds", id)}
          />
        </div>
      </div>

      <EventFormFooter
        form={form}
        onCancel={onClose}
        onSubmit={handleSubmit}
        onDeleted={handleDone}
      />
    </>
  );
}
