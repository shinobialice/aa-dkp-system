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

const allUsers = ["Vladzor", "Mazik", "Shaiya", "Verta", "Rrrr"];
const extendedItems = ["Эссенция ярости", "Трофейная эссенция стихий"];

const mockQueue: Record<
  string,
  {
    username: string;
    status?: string;
    synthTarget?: string;
    remaining?: number;
  }[]
> = {
  "Клык Калидиса": [{ username: "Vladzor" }, { username: "Mazik" }],
  "Эссенция ярости": [
    {
      username: "Shaiya",
      status: "ожидание",
      synthTarget: "Кристалл",
      remaining: 3,
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

  const isExtended = extendedItems.includes(itemName);

  const handleAddToQueue = () => {
    if (!selectedUser) return;
    const newEntry = isExtended
      ? {
          username: selectedUser,
          status: "ожидание",
          synthTarget: "",
          remaining: 1,
        }
      : { username: selectedUser };
    setQueue((prev) => ({
      ...prev,
      [itemName]: [...(prev[itemName] || []), newEntry],
    }));
    setSelectedUser("");
    setSearchUser("");
  };

  const handleSold = (username: string) => {
    setQueue((prev) => ({
      ...prev,
      [itemName]: (prev[itemName] || []).filter((u) => u.username !== username),
    }));
    console.log(`Добавлен в инвентарь: ${username} => ${itemName}`);
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

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-[520px]">
        <div className="text-sm font-semibold mb-2">Очередь на: {itemName}</div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Игрок</TableHead>
              {isExtended && <TableHead>Статус</TableHead>}
              {isExtended && <TableHead>Синтез</TableHead>}
              {isExtended && <TableHead>Осталось</TableHead>}
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(queue[itemName] || []).map((entry, index) => (
              <TableRow key={entry.username}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{entry.username}</TableCell>
                {isExtended && (
                  <>
                    <TableCell>
                      <select
                        className="text-xs border rounded"
                        value={entry.status || "ожидание"}
                        onChange={(e) =>
                          handleChange(index, "status", e.target.value)
                        }
                      >
                        <option value="продано">Продано</option>
                        <option value="пропуск">Пропуск</option>
                        <option value="позже">Позже</option>
                        <option value="ожидание">Ожидание</option>
                      </select>
                    </TableCell>
                    <TableCell>
                      <Input
                        className="text-xs"
                        value={entry.synthTarget || ""}
                        onChange={(e) =>
                          handleChange(index, "synthTarget", e.target.value)
                        }
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        className="text-xs w-14"
                        type="number"
                        min={0}
                        value={entry.remaining ?? 1}
                        onChange={(e) =>
                          handleChange(
                            index,
                            "remaining",
                            Number(e.target.value)
                          )
                        }
                      />
                    </TableCell>
                  </>
                )}
                <TableCell>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleSold(entry.username)}
                  >
                    Продано
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="mt-3 space-y-2">
          <Input
            placeholder="Поиск игрока..."
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value)}
          />
          <div className="max-h-[100px] overflow-y-auto border rounded px-2 py-1">
            {allUsers
              .filter((u) => u.toLowerCase().includes(searchUser.toLowerCase()))
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
      </PopoverContent>
    </Popover>
  );
}
