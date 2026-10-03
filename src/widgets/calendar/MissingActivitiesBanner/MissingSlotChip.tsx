import { X } from "lucide-react";
import type { MissingSlot } from "@/actions/getMissingActivities";

type Props = {
  slot: MissingSlot;
  canEdit: boolean;
  pending: boolean;
  onRemove: () => void;
};

export default function MissingSlotChip({
  slot,
  canEdit,
  pending,
  onRemove,
}: Props) {
  return (
    <span className="inline-flex h-6.5 items-center gap-0.5 rounded-full bg-background pr-1 pl-2.5 text-xs text-foreground/80">
      {slot.time} {slot.bossName}
      {slot.isManual && (
        <span className="text-muted-foreground"> (вручную)</span>
      )}
      {canEdit && (
        <button
          type="button"
          onClick={onRemove}
          disabled={pending}
          aria-label="Убрать из списка"
          title="Убрать из списка"
          className="flex size-5 cursor-pointer items-center justify-center rounded-full text-muted-foreground hover:text-destructive disabled:opacity-50"
        >
          <X className="size-3" />
        </button>
      )}
      {!canEdit && <span className="w-1.5" />}
    </span>
  );
}
