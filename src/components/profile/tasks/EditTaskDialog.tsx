"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TaskDatePicker } from "./TaskDatePicker";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import * as React from "react";
import { Task } from "./types/task";
import { updateTask } from "./services/tasksApi";
import { useTaskForm } from "./hooks/useTaskForm";

interface EditTaskDialogProps {
  open: boolean;
  onOpenChangeAction: (open: boolean) => void;
  task: Task;
  userId: number;
  onTaskUpdatedAction: () => void;
}

export function EditTaskDialog({
  open,
  onOpenChangeAction,
  task,
  userId,
  onTaskUpdatedAction,
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
    setLoading,
  } = useTaskForm(task);

  async function handleUpdateTask() {
    try {
      setLoading(true);
      await updateTask(userId, task.id, {
        name,
        created_at: createdAt.toISOString(),
        completed_at:
          status === "completed" && completedAt
            ? completedAt.toISOString()
            : null,
      });

      onTaskUpdatedAction();
      onOpenChangeAction(false);
    } catch (error) {
      alert("Ошибка при обновлении задания");
    } finally {
      setLoading(false);
    }
  }

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
          <div className="grid grid-cols-3 items-center gap-4">
            <Label>Статус</Label>
            <Select
              value={status}
              onValueChange={(value: "in_progress" | "completed") =>
                setStatus(value)
              }
            >
              <SelectTrigger className="w-[186px]">
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
            <Button variant="secondary">Отмена</Button>
          </DialogClose>
          <Button onClick={handleUpdateTask} disabled={loading}>
            {loading ? "Сохранение..." : "Сохранить"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
