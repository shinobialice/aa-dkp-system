import * as React from "react";
import { useTaskForm } from "./hooks/useTaskForm";
import { TaskDatePicker } from "./TaskDatePicker";
import { Task } from "./types/task";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import editUserTask from "@/src/actions/editUserTask";

type EditTaskDialogProps = {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  task: Task;
  userId: number;
  onChange: () => void;
};

export function EditTaskDialog({
  open,
  onOpenChangeAction,
  task,
  userId,
  onChange,
}: EditTaskDialogProps) {
  const {
    name,
    setName,
    createdAt,
    setCreatedAt,
    status,
    setStatus,
    completedAt,
    setCompletedAt,
    loading,
  } = useTaskForm(task);

  return (
    <Dialog open={open} onOpenChange={onOpenChangeAction}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Редактировать задание</DialogTitle>
          <DialogDescription>
            Измените данные задания ниже и сохраните изменения.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-3 items-center gap-4">
            <Label>Название</Label>
            <Input
              className="col-span-2 h-8"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label>Дата создания</Label>
            <TaskDatePicker
              value={createdAt}
              onChange={(date) => date && setCreatedAt(date)}
            />
          </div>
          <div className="grid grid-cols-3 items-center gap-4 ">
            <Label>Статус</Label>
            <Select
              value={status}
              onValueChange={(value: "in_progress" | "completed") =>
                setStatus(value)
              }
            >
              <SelectTrigger className="w-[245px] cursor-pointer">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in_progress">В процессе</SelectItem>
                <SelectItem value="completed">Выполнено</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label>Дата завершения</Label>
            <TaskDatePicker
              value={completedAt || undefined}
              onChange={(date) => setCompletedAt(date ?? null)}
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button className="cursor-pointer" variant="secondary">
              Отмена
            </Button>
          </DialogClose>
          <Button
            className="cursor-pointer"
            onClick={async () => {
              await editUserTask(userId, task.id, name, createdAt, completedAt);
              onChange();
              onOpenChangeAction(false);
            }}
            disabled={loading}
          >
            {loading ? "Сохранение..." : "Сохранить"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
