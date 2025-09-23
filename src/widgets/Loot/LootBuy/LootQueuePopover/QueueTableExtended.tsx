import { LootQueueEntry } from "./LootQueueTypes";
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
};

export function QueueTableExtended({
  queue,
  editMode,
  handleChange,
  handleSold,
}: Props) {
  return (
    <div className="max-h-[420px] border rounded mt-4">
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
          {queue.map((entry, index) => {
            const remaining = (entry.required || 0) - (entry.delivered || 0);
            return (
              <TableRow key={entry.id}>
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
                    return <span>{entry.status || "-"}</span>;
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
                    return (
                      <span className="w-[80px] truncate inline-block">
                        {entry.synth_target || "-"}
                      </span>
                    );
                  })()}
                </TableCell>
                {editMode && (
                  <TableCell>
                    <Button
                      className="cursor-pointer"
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        handleSold(entry);
                      }}
                      disabled={(entry.required || 0) > (entry.delivered || 0)}
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
  );
}
