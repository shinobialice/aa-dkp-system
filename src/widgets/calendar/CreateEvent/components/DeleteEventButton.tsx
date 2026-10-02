"use client";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/shared/ui";
import { Trash2 } from "lucide-react";
import { Button } from "@/shared/ui";
import deleteEvent from "@/actions/deleteEvent";

export function DeleteEventButton({
  eventId,
  onSuccess,
}: {
  eventId: number;
  onSuccess: () => void;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          variant="ghost"
          aria-label="Удалить рейд"
          className="h-11 cursor-pointer text-destructive hover:bg-destructive/10 hover:text-destructive sm:h-9"
        >
          <Trash2 />
          <span className="hidden sm:inline">Удалить рейд</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
          <AlertDialogDescription>
            Рейд и отметки участников удалятся безвозвратно.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              await deleteEvent(eventId);
              onSuccess();
            }}
          >
            Удалить
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
