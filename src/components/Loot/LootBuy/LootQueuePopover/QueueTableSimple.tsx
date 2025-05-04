import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";

export function QueueTableSimple({ queue, editMode, handleSold }) {
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
                <Button variant="secondary" size="sm" onClick={() => handleSold(entry.username, entry.delivered ?? 0)}>
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