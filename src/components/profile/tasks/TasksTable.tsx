"use client";

import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CreateTaskPopover } from "./CreateTaskPopover";
import { EditTaskDialog } from "./EditTaskDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVerticalIcon } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import React from "react";
import { fetchTasks, deleteTask as deleteTaskApi } from "./services/tasksApi";
import { Task } from "./types/task";

interface TasksTableClientProps {
  tasks: Task[];
  userId: number;
}

export default function TasksTable({
  tasks: initialTasks,
  userId,
}: TasksTableClientProps) {
  const [tasks, setTasks] = React.useState<Task[]>(initialTasks);
  const [openDialogId, setOpenDialogId] = React.useState<number | null>(null);
  const [editDialogTask, setEditDialogTask] = React.useState<Task | null>(null);

  async function reloadTasks() {
    try {
      const data = await fetchTasks(userId);
      setTasks(data);
    } catch (error) {
      alert("Ошибка загрузки заданий");
    }
  }

  async function handleDeleteTask(taskId: number) {
    try {
      await deleteTaskApi(userId, taskId);
      setOpenDialogId(null);
      await reloadTasks();
    } catch (error) {
      alert("Ошибка при удалении задания");
    }
  }

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="flex items-center justify-between">
          Задания игрока
          <CreateTaskPopover
            userId={userId}
            onTaskCreatedAction={reloadTasks}
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        {tasks.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Название</TableHead>
                <TableHead>Дата создания</TableHead>
                <TableHead>Статус</TableHead>
                <TableHead>Дата завершения</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell>{task.name || "Без названия"}</TableCell>
                  <TableCell>
                    {new Date(task.created_at).toLocaleDateString("ru-RU")}
                  </TableCell>
                  <TableCell>
                    {task.completed_at ? (
                      <Badge className="bg-green-500">Выполнено</Badge>
                    ) : (
                      <Badge variant="outline">В процессе</Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {task.completed_at
                      ? new Date(task.completed_at).toLocaleDateString("ru-RU")
                      : "—"}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="flex size-8 text-muted-foreground data-[state=open]:bg-muted"
                          size="icon"
                        >
                          <MoreVerticalIcon />
                          <span className="sr-only">Открыть меню</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-32">
                        <DropdownMenuItem
                          onClick={() => setEditDialogTask(task)}
                        >
                          Изменить
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setOpenDialogId(task.id)}
                        >
                          Удалить
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <AlertDialog
                      open={openDialogId === task.id}
                      onOpenChange={(open) => {
                        if (!open) setOpenDialogId(null);
                      }}
                    >
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Вы уверены, что хотите удалить задание "
                            {task.name || "Без названия"}"?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Это действие необратимо. Задание будет удалено
                            навсегда.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Отмена</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteTask(task.id)}
                          >
                            Удалить
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Нет активных заданий
          </div>
        )}
      </CardContent>

      {editDialogTask && (
        <EditTaskDialog
          open={!!editDialogTask}
          onOpenChangeAction={(open) => {
            if (!open) setEditDialogTask(null);
          }}
          task={editDialogTask}
          userId={userId}
          onTaskUpdatedAction={reloadTasks}
        />
      )}
    </Card>
  );
}
