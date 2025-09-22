import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type Props = {
  allUsers: string[];
  searchUser: string;
  setSearchUser: (val: string) => void;
  selectedUser: string;
  setSelectedUser: (val: string) => void;
  onAdd: () => void;
};

export function AddToQueueForm({
  allUsers,
  searchUser,
  setSearchUser,
  selectedUser,
  setSelectedUser,
  onAdd,
}: Props) {
  return (
    <div className="space-y-2">
      <Input
        placeholder="Поиск игрока..."
        value={searchUser}
        onChange={(e) => setSearchUser(e.target.value)}
      />
      <div className="max-h-[100px] overflow-y-auto border rounded px-2 py-1">
        {allUsers
          .filter((u) => u.toLowerCase().includes(searchUser.toLowerCase()))
          .map((u) => (
            <div
              key={u}
              className={cn(
                "cursor-pointer px-2 py-1 rounded hover:bg-muted",
                u === selectedUser && "bg-muted",
              )}
              onClick={() => setSelectedUser(u)}
            >
              {u}
            </div>
          ))}
      </div>
      <Button
        variant="default"
        className="w-full cursor-pointer"
        onClick={onAdd}
        disabled={!selectedUser}
      >
        Добавить в очередь
      </Button>
    </div>
  );
}
