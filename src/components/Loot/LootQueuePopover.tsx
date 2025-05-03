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

const allUsers = ["Vladzor", "Mazik", "Shaiya", "Verta", "Rrrr"];

const mockQueue: Record<string, { username: string }[]> = {
  "Клык Калидиса": [{ username: "Vladzor" }, { username: "Mazik" }],
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

  const handleAddToQueue = () => {
    if (!selectedUser) return;
    setQueue((prev) => ({
      ...prev,
      [itemName]: [...(prev[itemName] || []), { username: selectedUser }],
    }));
    setSelectedUser("");
    setSearchUser("");
  };

  const handleSold = (username: string) => {
    // Remove from queue
    setQueue((prev) => ({
      ...prev,
      [itemName]: (prev[itemName] || []).filter((u) => u.username !== username),
    }));

    // Here you would call an API to move the item to user inventory
    console.log(`Добавлен в инвентарь: ${username} => ${itemName}`);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="w-[300px]">
        <div className="text-sm font-semibold mb-2">Очередь на: {itemName}</div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Игрок</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {(queue[itemName] || []).map((entry, index) => (
              <TableRow key={entry.username}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{entry.username}</TableCell>
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
                  className={`cursor-pointer px-2 py-1 rounded hover:bg-muted ${
                    u === selectedUser ? "bg-muted" : ""
                  }`}
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
