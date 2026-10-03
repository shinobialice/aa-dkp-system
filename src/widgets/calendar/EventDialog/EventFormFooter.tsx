import { Loader2 } from "lucide-react";
import { Button } from "@/shared/ui";
import DeleteEventButton from "./DeleteEventButton";
import { hasErrors, participantsLabel } from "./eventFormModel";
import type { EventForm } from "./useEventForm";

type Props = {
  form: EventForm;
  onCancel: () => void;
  onSubmit: () => void;
  onDeleted: () => void;
};

export default function EventFormFooter({
  form,
  onCancel,
  onSubmit,
  onDeleted,
}: Props) {
  const isEdit = form.mode === "edit";

  return (
    <div className="flex shrink-0 items-center gap-2 border-t bg-muted/40 px-4 py-3 md:px-5">
      {isEdit && form.event && (
        <DeleteEventButton eventId={form.event.id} onDeleted={onDeleted} />
      )}
      {hasErrors(form.errors) && (
        <span className="text-sm text-destructive">
          Заполните тип, босса и время
        </span>
      )}
      <Button
        variant="outline"
        onClick={onCancel}
        className="ml-auto hidden cursor-pointer sm:inline-flex"
      >
        Отмена
      </Button>
      <Button
        onClick={onSubmit}
        disabled={form.submitting}
        className="h-11 flex-1 cursor-pointer sm:h-9 sm:flex-none"
      >
        {form.submitting && <Loader2 className="animate-spin" />}
        {isEdit ? "Сохранить" : "Создать"} ·{" "}
        {participantsLabel(form.selectedUsers.length)}
      </Button>
    </div>
  );
}
