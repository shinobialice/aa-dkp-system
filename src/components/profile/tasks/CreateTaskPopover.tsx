import * as React from "react";
import { useTaskForm } from "./hooks/useTaskForm";
import { TaskDatePicker } from "./TaskDatePicker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import createUserTask from "@/src/actions/createUserTask";

type CreateTaskPopoverProps = {
  userId: number;
  onChange: () => void;
}

export function CreateTaskPopover({
  userId,
  onChange,
}: CreateTaskPopoverProps) {
  const [open, setOpen] = React.useState(false);

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
  } = useTaskForm();

  function resetForm() {
    setOpen(false);
    setName("");
    setCreatedAt(new Date());
    setStatus("in_progress");
    setCompletedAt(null);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="ml-auto cursor-pointer">
          Добавить задание
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px]">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Добавить задание</h4>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="tasks.name">Название</Label>
              <Input
                id="tasks.name"
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
                <SelectTrigger className="w-[186px] cursor-pointer">
                  <SelectValue placeholder="Статус" />
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
            <Button
              className="cursor-pointer"
              onClick={async () => {
                await createUserTask(userId, name, createdAt, completedAt);
                onChange();
                resetForm();
              }}
              disabled={loading}
            >
              {loading ? "Создание..." : "Создать"}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
