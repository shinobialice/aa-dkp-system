"use client";

import { Trash2 } from "lucide-react";
import deleteEvent from "@/actions/deleteEvent";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  Button,
} from "@/shared/ui";

type Props = {
  eventId: number;
  onDeleted: () => void;
};

export default function DeleteEventButton({ eventId, onDeleted }: Props) {
  const handleDelete = async () => {
    await deleteEvent(eventId);
    onDeleted();
  };

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
          <AlertDialogAction onClick={handleDelete}>Удалить</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
