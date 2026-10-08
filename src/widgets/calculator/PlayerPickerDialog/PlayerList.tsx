import { getActiveUsers } from "@/actions/getActiveUsers";
import { useAsyncData } from "@/hooks/useAsyncData";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/shared/ui";

type Props = {
  onSelect: (playerId: number) => void;
};

export default function PlayerList({ onSelect }: Props) {
  const { data, error, isLoading } = useAsyncData(
    "calculator-players",
    getActiveUsers,
  );
  const players = [...(data ?? [])].sort((a, b) =>
    a.username.localeCompare(b.username, "ru"),
  );
  const emptyText = isLoading
    ? "Загружаем игроков…"
    : "Никого не нашли по этому нику";

  if (error) {
    return (
      <p className="text-sm text-destructive">
        Не удалось загрузить список игроков
      </p>
    );
  }

  return (
    <Command className="rounded-lg border">
      <CommandInput placeholder="Ник игрока…" autoFocus />
      <CommandList className="max-h-72">
        <CommandEmpty>{emptyText}</CommandEmpty>
        {players.map((player) => (
          <CommandItem
            key={player.id}
            value={player.username}
            className="cursor-pointer justify-between"
            onSelect={() => onSelect(player.id)}
          >
            <span className="truncate">{player.username}</span>
            {player.class && (
              <span className="text-xs text-muted-foreground">
                {player.class}
              </span>
            )}
          </CommandItem>
        ))}
      </CommandList>
    </Command>
  );
}
