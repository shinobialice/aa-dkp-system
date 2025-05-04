"use client";

import { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Pen } from "lucide-react";

const allUsers = ["Vladzor", "Mazik", "Shaiya", "Verta", "Rrrr"];
const extendedItems = ["Эссенция ярости", "Трофейная эссенция стихий"];

const mockQueue: Record<
  string,
  {
    username: string;
    status?: string;
    synthTarget?: string;
    delivered?: number;
    required?: number;
    createdAt?: Date;
  }[]
> = {
  "Эссенция ярости": [
    {
      username: "Dimonishx",
      status: "позже",
      synthTarget: "...",
      required: 1000000,
      delivered: 185268,
    },
    {
      username: "Бобр",
      status: "продано",
      synthTarget: "Сет Анталона",
      delivered: 700000,
    },
    {
      username: "Felanza",
      status: "пропуск",
      synthTarget: "Булава с Ксанатоса и Щит с Ксанатоса",
      delivered: 407296,
    },
  ],
};

export function LootQueuePopover({
  itemName,
  children,
}: {
  itemName: string;
  children: ReactNode;
}) {
  const [searchUser, setSearchUser] = useState("");
  const [selectedUser, setSelectedUser] = useState("");
  const [queue, setQueue] = useState(mockQueue);
  const [editMode, setEditMode] = useState(false);

  const isExtended = extendedItems.includes(itemName);

  const handleAddToQueue = () => {
    if (!selectedUser) return;
    const now = new Date();
    const newEntry = {
      username: selectedUser,
      createdAt: now,
      ...(isExtended
        ? {
            status: "позже",
            synthTarget: "",
            delivered: 0,
            required: 0,
          }
        : {}),
    };
    setQueue((prev) => ({
      ...prev,
      [itemName]: [...(prev[itemName] || []), newEntry],
    }));
    setSelectedUser("");
    setSearchUser("");
  };

  const handleSold = (username: string, totalDelivered: number) => {
    setQueue((prev) => ({
      ...prev,
      [itemName]: (prev[itemName] || []).filter((u) => u.username !== username),
    }));
    console.log(
      `Добавлен в инвентарь: ${username} => ${itemName}, всего отдано: ${totalDelivered}`
    );
  };

  const handleChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    setQueue((prev) => {
      const newQueue = [...(prev[itemName] || [])];
      newQueue[index] = { ...newQueue[index], [field]: value };
      return { ...prev, [itemName]: newQueue };
    });
  };

  if (!isExtended) {
    return (
      <Popover>
        <PopoverTrigger asChild>{children}</PopoverTrigger>
        <PopoverContent className="w-[620px]">
          <div className="flex items-center justify-between mb-2">
            <div className="text-sm font-semibold">Очередь на: {itemName}</div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setEditMode((prev) => !prev)}
            >
              {editMode ? (
                "Сохранить"
              ) : (
                <>
                  <Pen className="h-3 w-3 mr-1" /> Редактировать
                </>
              )}
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>#</TableHead>
                <TableHead>Игрок</TableHead>
                <TableHead>Встал в очередь</TableHead>
                <TableHead />
              </TableRow>
            </TableHeader>
            <TableBody>
              {(queue[itemName] || []).map((entry, index) => (
                <TableRow key={entry.username}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{entry.username}</TableCell>
                  <TableCell>
                    {entry.createdAt
                      ? new Date(entry.createdAt).toLocaleString("ru-RU", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                        })
                      : "-"}
                  </TableCell>
                  {editMode && (
                    <TableCell className="text-right">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() =>
                          handleSold(entry.username, entry.delivered ?? 0)
                        }
                      >
                        Продано
                      </Button>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {editMode && (
            <div className="mt-3 space-y-2">
              <Input
                placeholder="Поиск игрока..."
                value={searchUser}
                onChange={(e) => setSearchUser(e.target.value)}
              />
              <div className="max-h-[100px] overflow-y-auto border rounded px-2 py-1">
                {allUsers
                  .filter((u) =>
                    u.toLowerCase().includes(searchUser.toLowerCase())
                  )
                  .map((u) => (
                    <div
                      key={u}
                      className={cn(
                        "cursor-pointer px-2 py-1 rounded hover:bg-muted",
                        u === selectedUser && "bg-muted"
                      )}
                      onClick={() => setSelectedUser(u)}
                    >
                      {u}
                    </div>
                  ))}
              </div>
              <Button
                variant="default"
                className="w-full"
                onClick={handleAddToQueue}
                disabled={!selectedUser}
              >
                Добавить в очередь
              </Button>
            </div>
          )}
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="w-[1200px]">
        <DialogHeader>
          <DialogTitle>Очередь на: {itemName}</DialogTitle>
          <Button
            size="sm"
            variant="outline"
            className="ml-auto"
            onClick={() => setEditMode((prev) => !prev)}
          >
            {editMode ? (
              "Сохранить"
            ) : (
              <>
                <Pen className="h-3 w-3 mr-1" /> Редактировать
              </>
            )}
          </Button>
        </DialogHeader>
        <div className="max-h-[420px] overflow-y-auto border rounded mt-4">
          <Table>
            <TableHeader className="sticky top-0 z-1 bg-background">
              <TableRow>
                <TableHead className="w-[30px]">#</TableHead>
                <TableHead className="w-[100px]">Игрок</TableHead>
                <TableHead className="w-[100px]">Запрошено</TableHead>
                <TableHead className="w-[100px]">Отдано</TableHead>
                <TableHead className="w-[100px]">Осталось</TableHead>
                <TableHead className="w-[100px]">Статус</TableHead>
                <TableHead>Синтезируемые предметы</TableHead>
                <TableHead className="w-[80px]" />
              </TableRow>
            </TableHeader>
            <TableBody>
              {(queue[itemName] || []).map((entry, index) => {
                const remaining =
                  (entry.required || 0) - (entry.delivered || 0);
                return (
                  <TableRow key={entry.username}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{entry.username}</TableCell>
                    <TableCell>
                      {editMode ? (
                        <Input
                          type="number"
                          min={0}
                          value={entry.required ?? 0}
                          onChange={(e) =>
                            handleChange(
                              index,
                              "required",
                              Number(e.target.value)
                            )
                          }
                        />
                      ) : (
                        <span>
                          {entry.required
                            ?.toLocaleString("ru-RU")
                            .replaceAll(",", " ") || "-"}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {editMode ? (
                        <Input
                          type="number"
                          min={0}
                          value={entry.delivered ?? 0}
                          onChange={(e) =>
                            handleChange(
                              index,
                              "delivered",
                              Number(e.target.value)
                            )
                          }
                        />
                      ) : (
                        <span>
                          {entry.delivered
                            ?.toLocaleString("ru-RU")
                            .replaceAll(",", " ") || "-"}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      {remaining > 0
                        ? remaining.toLocaleString("ru-RU").replaceAll(",", " ")
                        : 0}
                    </TableCell>
                    <TableCell>
                      {editMode ? (
                        <select
                          className=" border rounded"
                          value={entry.status || "позже"}
                          onChange={(e) =>
                            handleChange(index, "status", e.target.value)
                          }
                        >
                          <option value="продано">Продано</option>
                          <option value="пропуск">Пропуск</option>
                          <option value="позже">Позже</option>
                          <option value="ожидание">Ожидание</option>
                        </select>
                      ) : (
                        <span>{entry.status || "-"}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {editMode ? (
                        <Input
                          className=" w-80"
                          value={entry.synthTarget || ""}
                          onChange={(e) =>
                            handleChange(index, "synthTarget", e.target.value)
                          }
                        />
                      ) : (
                        <span className="w-80 truncate  inline-block">
                          {entry.synthTarget || "-"}
                        </span>
                      )}
                    </TableCell>
                    {editMode && (
                      <TableCell>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() =>
                            handleSold(entry.username, entry.delivered ?? 0)
                          }
                          disabled={
                            (entry.required || 0) > (entry.delivered || 0)
                          }
                        >
                          Продано
                        </Button>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        {editMode && (
          <div className="mt-6 space-y-2">
            <Input
              placeholder="Поиск игрока..."
              value={searchUser}
              onChange={(e) => setSearchUser(e.target.value)}
            />
            <div className="max-h-[100px] overflow-y-auto border rounded px-2 py-1">
              {allUsers
                .filter((u) =>
                  u.toLowerCase().includes(searchUser.toLowerCase())
                )
                .map((u) => (
                  <div
                    key={u}
                    className={cn(
                      "cursor-pointer px-2 py-1 rounded hover:bg-muted",
                      u === selectedUser && "bg-muted"
                    )}
                    onClick={() => setSelectedUser(u)}
                  >
                    {u}
                  </div>
                ))}
            </div>
            <Button
              variant="default"
              className="w-full"
              onClick={handleAddToQueue}
              disabled={!selectedUser}
            >
              Добавить в очередь
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
