'use client";';
import React from "react";
import { MoreVerticalIcon } from "lucide-react";
import { CreateTaskPopover } from "./CreateTaskPopover";
import { EditTaskDialog } from "./EditTaskDialog";
import { Task } from "./types/task";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import deleteUserTask from "@/src/actions/deleteUserTask";

type Props = {
  tasks: Task[];
  userId: number;
  onChange: () => void;
  isAdmin: boolean;
};

export default function TasksTable({
  tasks,
  userId,
  onChange,
  isAdmin,
}: Props) {
  const [openDialogId, setOpenDialogId] = React.useState<number | null>(null);
  const [editDialogTask, setEditDialogTask] = React.useState<Task | null>(null);

  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle className="flex items-center justify-between">
          Задания игрока
          {isAdmin && <CreateTaskPopover userId={userId} onChange={onChange} />}
        </CardTitle>
      </CardHeader>
      {(() => {
        if (tasks.length > 0) {
          return (
            <CardContent>
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
                        {(() => {
                          if (task.completed_at) {
                            return (
                              <Badge className="bg-green-500">Выполнено</Badge>
                            );
                          }
                          return <Badge variant="outline">В процессе</Badge>;
                        })()}
                      </TableCell>
                      <TableCell>
                        {task.completed_at
                          ? new Date(task.completed_at).toLocaleDateString(
                              "ru-RU"
                            )
                          : "—"}
                      </TableCell>
                      <TableCell>
                        {isAdmin && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className="flex size-8 text-muted-foreground cursor-pointer data-[state=open]:bg-muted"
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
                        )}

                        <AlertDialog
                          open={openDialogId === task.id}
                          onOpenChange={(open) => {
                            if (!open) {
                              setOpenDialogId(null);
                            }
                          }}
                        >
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Вы уверены, что хотите удалить задание &quot;
                                {task.name || "Без названия"}
                                &quot;?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Это действие необратимо. Задание будет удалено
                                навсегда.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Отмена</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={async () => {
                                  await deleteUserTask(task.id);
                                  onChange();
                                }}
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
            </CardContent>
          );
        }
        return (
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              Нет активных заданий
            </div>
          </CardContent>
        );
      })()}

      {editDialogTask && (
        <EditTaskDialog
          open={!!editDialogTask}
          onOpenChangeAction={(open) => {
            if (!open) {
              setEditDialogTask(null);
            }
          }}
          task={editDialogTask}
          userId={userId}
          onChange={onChange}
        />
      )}
    </Card>
  );
}
