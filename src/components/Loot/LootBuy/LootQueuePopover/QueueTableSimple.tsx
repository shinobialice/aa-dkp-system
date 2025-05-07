import { LootQueueEntry } from "./LootQueueTypes";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

type Props = {
  queue: LootQueueEntry[];
  editMode: boolean;
  handleSold: (entry: LootQueueEntry) => void;
};

export function QueueTableSimple({ queue, editMode, handleSold }: Props) {
  return (
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
        {queue.map((entry, index) => (
          <TableRow key={entry.id}>
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
                className="cursor-pointer"
                  variant="secondary"
                  size="sm"
                  onClick={() => handleSold(entry)}
                >
                  Продано
                </Button>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
