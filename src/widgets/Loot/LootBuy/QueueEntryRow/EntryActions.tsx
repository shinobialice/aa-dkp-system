import type { ReactNode } from "react";
import { Check, Clock, MoreHorizontal, Pause, Trash2 } from "lucide-react";
import { cn } from "@/shared/lib/tw-merge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui";
import type { QueueEntry } from "../lootBuyModel";
import type { QueueEntryHandlers } from "./types";

type Props = {
  entry: QueueEntry;
  soldBlocked: boolean;
  handlers: QueueEntryHandlers;
};

export default function EntryActions({ entry, soldBlocked, handlers }: Props) {
  return (
    <span className="flex shrink-0 items-center gap-0.5">
      <IconAction
        label={soldBlocked ? "Продано — когда отдано всё" : "Продано"}
        onClick={() => handlers.onSold(entry)}
        disabled={soldBlocked}
        className="bg-green-100 text-green-800 hover:bg-green-200 dark:bg-green-500/15 dark:text-green-300"
      >
        <Check />
      </IconAction>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label={`Действия: ${entry.username}`}
            className="flex size-8 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <MoreHorizontal className="size-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={() => handlers.onToggleStatus(entry, "позже")}
          >
            <Clock />
            {entry.status === "позже" ? "Убрать «Позже»" : "Позже"}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="cursor-pointer"
            onSelect={() => handlers.onToggleStatus(entry, "пропуск")}
          >
            <Pause />
            {entry.status === "пропуск" ? "Убрать «Пропуск»" : "Пропуск"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            className="cursor-pointer"
            onSelect={() => handlers.onRemove(entry)}
          >
            <Trash2 />
            Удалить из очереди
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </span>
  );
}

function IconAction({
  label,
  onClick,
  disabled,
  className,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "flex size-8 cursor-pointer items-center justify-center rounded-md transition-colors disabled:cursor-not-allowed disabled:opacity-40 [&_svg]:size-4",
        className,
      )}
    >
      {children}
    </button>
  );
}
