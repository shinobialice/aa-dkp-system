"use client";

import type { RaidDetails } from "@/actions/getRaidById";
import { Dialog, DialogContent } from "@/shared/ui";
import RaidDetailsContent from "./RaidDetailsContent";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  raid: RaidDetails | null;
  currentUserId: number | null;
  canEdit: boolean;
  onEdit: () => void;
};

export default function RaidDetailsDialog({
  open,
  onOpenChange,
  raid,
  currentUserId,
  canEdit,
  onEdit,
}: Props) {
  if (!raid) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[88dvh] flex-col gap-0 overflow-hidden p-0 sm:max-w-2xl">
        <RaidDetailsContent
          key={raid.id}
          raid={raid}
          currentUserId={currentUserId}
          canEdit={canEdit}
          onEdit={onEdit}
        />
      </DialogContent>
    </Dialog>
  );
}
