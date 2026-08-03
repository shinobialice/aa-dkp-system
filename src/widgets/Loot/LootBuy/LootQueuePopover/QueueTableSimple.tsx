import { useState } from "react";
import { GripVertical } from "lucide-react";
import { LootQueueEntry } from "./LootQueueTypes";
import { StatusBadge } from "./StatusBadge";
import { Button } from "@/shared/ui";
import { Input } from "@/shared/ui";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/shared/ui";

type Props = {
  queue: LootQueueEntry[];
  editMode: boolean;
  showRoll: boolean;
  handleSold: (entry: LootQueueEntry) => void;
  handleRemove: (entry: LootQueueEntry) => void;
  handleReorder: (fromIndex: number, toIndex: number) => void;
  handleRollChange: (entry: LootQueueEntry, roll: number | null) => void;
  handleStatusToggle: (
    entry: LootQueueEntry,
    status: "пропуск" | "позже",
  ) => void;
};

export function QueueTableSimple({
  queue,
  editMode,
  showRoll,
  handleSold,
  handleRemove,
  handleReorder,
  handleRollChange,
  handleStatusToggle,
}: Props) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const canDrag = editMode && !showRoll;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          {canDrag && <TableHead className="w-[24px]" />}
          <TableHead>#</TableHead>
          <TableHead>Игрок</TableHead>
          {showRoll && <TableHead>Ролл</TableHead>}
          <TableHead>Встал в очередь</TableHead>
          <TableHead />
        </TableRow>
      </TableHeader>
      <TableBody>
        {queue.map((entry, index) => (
          <TableRow
            key={entry.id}
            draggable={canDrag}
            onDragStart={() => setDragIndex(index)}
            onDragOver={(e) => {
              if (canDrag) e.preventDefault();
            }}
            onDrop={(e) => {
              if (!canDrag || dragIndex === null) return;
              e.preventDefault();
              if (dragIndex !== index) handleReorder(dragIndex, index);
              setDragIndex(null);
            }}
            onDragEnd={() => setDragIndex(null)}
          >
            {canDrag && (
              <TableCell className="cursor-grab active:cursor-grabbing">
                <GripVertical className="h-4 w-4 text-muted-foreground" />
              </TableCell>
            )}
            <TableCell>{index + 1}</TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <span>{entry.username}</span>
                <StatusBadge status={entry.status} />
              </div>
            </TableCell>
            {showRoll && (
              <TableCell>
                {editMode ? (
                  <Input
                    type="number"
                    className="w-20"
                    value={entry.roll ?? ""}
                    onChange={(e) =>
                      handleRollChange(
                        entry,
                        e.target.value === "" ? null : Number(e.target.value),
                      )
                    }
                  />
                ) : (
                  (entry.roll ?? "-")
                )}
              </TableCell>
            )}
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
                <div className="flex flex-wrap justify-end items-center gap-2">
                  <div className="flex gap-2">
                    <Button
                      className="cursor-pointer"
                      variant="secondary"
                      size="sm"
                      onClick={() => handleSold(entry)}
                    >
                      Продано
                    </Button>
                    <Button
                      className="cursor-pointer"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleRemove(entry)}
                    >
                      Удалить
                    </Button>
                  </div>
                  <div className="w-px self-stretch bg-border" />
                  <div className="flex gap-2">
                    <Button
                      className="cursor-pointer"
                      variant={
                        entry.status === "пропуск" ? "destructive" : "outline"
                      }
                      size="sm"
                      onClick={() => handleStatusToggle(entry, "пропуск")}
                    >
                      Пропуск
                    </Button>
                    <Button
                      className="cursor-pointer"
                      variant={
                        entry.status === "позже" ? "secondary" : "outline"
                      }
                      size="sm"
                      onClick={() => handleStatusToggle(entry, "позже")}
                    >
                      Позже
                    </Button>
                  </div>
                </div>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
