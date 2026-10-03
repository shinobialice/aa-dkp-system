import { ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui";

export type UsernameChange = {
  id: number;
  old_username: string;
  new_username: string;
  changed_at: string;
};

export default function UsernameHistory({
  history,
}: {
  history: UsernameChange[];
}) {
  if (history.length === 0) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="История ников"
          className="flex size-7 shrink-0 cursor-pointer items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        >
          <ChevronDown className="size-4" />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-72 p-3">
        <div className="mb-2 text-xs font-medium text-muted-foreground">
          Этот пользователь также использовал ники:
        </div>
        <div className="flex flex-col divide-y">
          {history.map((change) => (
            <div
              key={change.id}
              className="flex items-center justify-between gap-3 py-2"
            >
              <span className="truncate text-sm font-medium">
                {change.old_username}
              </span>
              <span className="shrink-0 text-xs text-muted-foreground">
                {new Date(change.changed_at).toLocaleDateString("ru-RU")}
              </span>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
