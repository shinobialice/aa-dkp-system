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
import { LootQueueEntry } from "./LootQueueTypes";

type Props = {
  queue: LootQueueEntry[];
  editMode: boolean;
  handleChange: (index: number, field: string, value: any) => void;
  handleSold: (entry: LootQueueEntry) => void;
};

export function QueueTableExtended({
  queue,
  editMode,
  handleChange,
  handleSold,
}: Props) {
  return (
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
          {queue.map((entry, index) => {
            const remaining = (entry.required || 0) - (entry.delivered || 0);
            return (
              <TableRow key={entry.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{entry.username}</TableCell>
                <TableCell>
                  {editMode ? (
                    <Input
                      type="number"
                      value={entry.required}
                      onChange={(e) =>
                        handleChange(index, "required", Number(e.target.value))
                      }
                    />
                  ) : (
                    entry.required
                  )}
                </TableCell>
                <TableCell>
                  {editMode ? (
                    <Input
                      type="number"
                      min={0}
                      value={entry.delivered ?? 0}
                      onChange={(e) =>
                        handleChange(index, "delivered", Number(e.target.value))
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
                  ) : (
                    <span>{entry.status || "-"}</span>
                  )}
                </TableCell>
                <TableCell>
                  {editMode ? (
                    <Input
                      value={entry.synth_target || ""}
                      onChange={(e) =>
                        handleChange(index, "synth_target", e.target.value)
                      }
                    />
                  ) : (
                    <span className="w-80 truncate inline-block">
                      {entry.synth_target || "-"}
                    </span>
                  )}
                </TableCell>
                {editMode && (
                  <TableCell>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        console.log("SOLD:", entry); // <-- добавь это
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
