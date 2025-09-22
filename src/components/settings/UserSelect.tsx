import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";
import { useState } from "react";

type UserOption = {
  id: number;
  username: string;
};

type Props = {
  users: UserOption[];
  selectedUserId: number | null;
  setSelectedUserId: (id: number | null) => void;
};

export function UserSelect({
  users,
  selectedUserId,
  setSelectedUserId,
}: Props) {
  const [open, setOpen] = useState(false);

  const selectedUser = users.find((u) => u.id === selectedUserId);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className="w-full justify-between cursor-pointer"
        >
          {selectedUser
            ? `${selectedUser.username} (id: ${selectedUser.id})`
            : "Выберите пользователя"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[380px] p-0">
        <Command>
          <CommandInput placeholder="Поиск пользователя..." />
          <CommandEmpty>Не найдено</CommandEmpty>
          <CommandGroup className="max-h-[500px] overflow-y-auto">
            {users.map((user) => (
              <CommandItem
                className="cursor-pointer"
                key={user.id}
                value={user.username}
                onSelect={() => {
                  setSelectedUserId(user.id);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    selectedUserId === user.id ? "opacity-100" : "opacity-0",
                  )}
                />
                {user.username} (id: {user.id})
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
