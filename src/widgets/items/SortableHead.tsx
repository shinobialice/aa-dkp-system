import { ArrowUp, ArrowDown, ChevronsUpDown } from "lucide-react";
import { TableHead } from "@/shared/ui";
import { type SortKey } from "./itemTypeSort";

function SortIcon({
  column,
  sortKey,
  sortDir,
}: {
  column: SortKey;
  sortKey: SortKey;
  sortDir: "asc" | "desc";
}) {
  if (column !== sortKey) {
    return <ChevronsUpDown className="size-3.5 text-muted-foreground" />;
  }
  return sortDir === "asc" ? (
    <ArrowUp className="size-3.5" />
  ) : (
    <ArrowDown className="size-3.5" />
  );
}

export default function SortableHead({
  column,
  sortKey,
  sortDir,
  onSort,
  children,
}: {
  column: SortKey;
  sortKey: SortKey;
  sortDir: "asc" | "desc";
  onSort: (column: SortKey) => void;
  children: React.ReactNode;
}) {
  return (
    <TableHead>
      <button
        type="button"
        onClick={() => onSort(column)}
        className="flex items-center gap-1 cursor-pointer hover:text-foreground"
      >
        {children}
        <SortIcon column={column} sortKey={sortKey} sortDir={sortDir} />
      </button>
    </TableHead>
  );
}
