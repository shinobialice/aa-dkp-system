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

type EditableField = "required" | "delivered" | "status" | "synth_target";

type Props = {
  queue: LootQueueEntry[];
  editMode: boolean;
  handleChange: (
    index: number,
    field: EditableField,
    value: string | number,
  ) => Promise<void>;
  handleSold: (entry: LootQueueEntry) => Promise<void>;
  handleRemove: (entry: LootQueueEntry) => Promise<void>;
  handleReorder: (fromIndex: number, toIndex: number) => void;
};

export function QueueTableExtended({
  queue,
  editMode,
  handleChange,
  handleSold,
  handleRemove,
  handleReorder,
}: Props) {
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  return (
    <div className="max-h-[420px] overflow-y-auto border rounded mt-4">
      <Table>
        <TableHeader className="sticky top-0 z-1 bg-background">
          <TableRow>
            {editMode && <TableHead className="w-[24px]" />}
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
          {queue.map((entry, index) => {
            const remaining = (entry.required || 0) - (entry.delivered || 0);
            return (
              <TableRow
                key={entry.id}
                draggable={editMode}
                onDragStart={() => setDragIndex(index)}
                onDragOver={(e) => {
                  if (editMode) e.preventDefault();
                }}
                onDrop={(e) => {
                  if (!editMode || dragIndex === null) return;
                  e.preventDefault();
                  if (dragIndex !== index) handleReorder(dragIndex, index);
                  setDragIndex(null);
                }}
                onDragEnd={() => setDragIndex(null)}
              >
                {editMode && (
                  <TableCell className="cursor-grab active:cursor-grabbing">
                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                  </TableCell>
                )}
                <TableCell>{index + 1}</TableCell>
                <TableCell>{entry.username}</TableCell>
                <TableCell>
                  {(() => {
                    if (editMode) {
                      return (
                        <Input
                          type="number"
                          value={entry.required}
                          onChange={(e) =>
                            handleChange(
                              index,
                              "required",
                              Number(e.target.value),
                            )
                          }
                        />
                      );
                    }
                    return entry.required;
                  })()}
                </TableCell>
                <TableCell>
                  {(() => {
                    if (editMode) {
                      return (
                        <Input
                          type="number"
                          min={0}
                          value={entry.delivered ?? 0}
                          onChange={(e) =>
                            handleChange(
                              index,
                              "delivered",
                              Number(e.target.value),
                            )
                          }
                        />
                      );
                    }
                    return (
                      <span>
                        {entry.delivered
                          ?.toLocaleString("ru-RU")
                          .replaceAll(",", " ") || "-"}
                      </span>
                    );
                  })()}
                </TableCell>
                <TableCell>
                  {remaining > 0
                    ? remaining.toLocaleString("ru-RU").replaceAll(",", " ")
                    : 0}
                </TableCell>
                <TableCell>
                  {(() => {
                    if (editMode) {
                      return (
                        <select
                          className="border rounded"
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
                      );
                    }
                    return entry.status &&
                      entry.status !== "продано" &&
                      entry.status !== "ожидание" ? (
                      <StatusBadge status={entry.status} />
                    ) : (
                      <span>{entry.status || "-"}</span>
                    );
                  })()}
                </TableCell>
                <TableCell>
                  {(() => {
                    if (editMode) {
                      return (
                        <Input
                          value={entry.synth_target || ""}
                          onChange={(e) =>
                            handleChange(index, "synth_target", e.target.value)
                          }
                        />
                      );
                    }
                    return <span>{entry.synth_target || "-"}</span>;
                  })()}
                </TableCell>
                {editMode && (
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        className="cursor-pointer"
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          handleSold(entry);
                        }}
                        disabled={
                          (entry.required || 0) > (entry.delivered || 0)
                        }
                      >
                        Продано
                      </Button>
                      <Button
                        className="cursor-pointer"
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          handleRemove(entry);
                        }}
                      >
                        Удалить
                      </Button>
                    </div>
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
