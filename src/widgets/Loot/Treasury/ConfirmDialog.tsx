"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui";

export type ConfirmRequest = {
  title: string;
  description: string;
  confirmLabel: string;
  errorMessage: string;
  onConfirm: () => Promise<void>;
};

type Props = {
  request: ConfirmRequest | null;
  onClose: () => void;
};

export default function ConfirmDialog({ request, onClose }: Props) {
  const [busy, setBusy] = useState(false);

  const handleConfirm = async () => {
    if (!request) return;
    setBusy(true);
    try {
      await request.onConfirm();
      onClose();
    } catch (error) {
      console.error(error);
      toast.error(request.errorMessage);
    } finally {
      setBusy(false);
    }
  };

  return (
    <AlertDialog
      open={!!request}
      onOpenChange={(open) => !open && !busy && onClose()}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{request?.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {request?.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={busy}>Отмена</AlertDialogCancel>
          <AlertDialogAction
            disabled={busy}
            className="bg-destructive text-white hover:bg-destructive/90"
            onClick={(event) => {
              event.preventDefault();
              handleConfirm();
            }}
          >
            {request?.confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
