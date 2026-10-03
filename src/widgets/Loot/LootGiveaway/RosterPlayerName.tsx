import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui";
import { type Player } from "./giveawayModel";
import { avatarSrc } from "@/shared/lib/format";

export default function PlayerName({ player }: { player: Player }) {
  return (
    <span className="flex min-w-0 items-center gap-2">
      <Avatar className="size-7 shrink-0">
        <AvatarImage
          src={avatarSrc(player.username, player.avatarUrl)}
          alt=""
        />
        <AvatarFallback className="text-2xs">
          {player.username.slice(0, 2)}
        </AvatarFallback>
      </Avatar>
      <span className="truncate font-semibold">{player.username}</span>
      {!player.active && (
        <span className="shrink-0 rounded-full border px-1.5 text-2xs text-muted-foreground">
          неактивен
        </span>
      )}
    </span>
  );
}
