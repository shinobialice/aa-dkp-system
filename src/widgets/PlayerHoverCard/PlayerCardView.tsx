import type { PlayerCard } from "@/actions/getPlayerCard";
import { attendanceTone, avatarSrc, formatNumber } from "@/shared/lib/format";
import { formatTenure } from "@/shared/lib/tenure";
import { cn } from "@/shared/lib/tw-merge";
import { Avatar, AvatarFallback, AvatarFrame, AvatarImage } from "@/shared/ui";
import ProfileBackdrop from "@/widgets/profile/info/ProfileBackdrop";

type Props = {
  player: PlayerCard;
};

export default function PlayerCardView({ player }: Props) {
  const { style } = player;
  const hasCover = style.coverUrl !== null;
  const gearScore = player.class_gear_score
    ? ` · ${formatNumber(player.class_gear_score)} ГС`
    : "";

  return (
    <div className="relative overflow-hidden p-4">
      <ProfileBackdrop
        coverUrl={style.coverUrl}
        effect={style.effect}
        coverClassName="-mx-4 -mt-4 mb-2 h-20"
      />
      <div className="flex items-end gap-3">
        <AvatarFrame
          frameUrl={style.frameUrl}
          className={cn("z-10", hasCover && "-mt-10")}
        >
          <Avatar className={cn("size-14", hasCover && "ring-4 ring-popover")}>
            <AvatarImage
              src={avatarSrc(player.username, player.avatar_url)}
              alt=""
            />
            <AvatarFallback>{player.username.slice(0, 2)}</AvatarFallback>
          </Avatar>
        </AvatarFrame>
        <div className="relative z-10 min-w-0 pb-1">
          <div className="truncate text-base font-bold">{player.username}</div>
          {!player.active && (
            <div className="text-xs text-muted-foreground">Не в составе</div>
          )}
        </div>
      </div>
      <dl className="relative z-10 mt-3 grid grid-cols-[auto_minmax(0,1fr)] gap-x-3 gap-y-1 text-sm">
        <dt className="text-muted-foreground">Класс</dt>
        <dd className="truncate">
          {player.class ?? "не указан"}
          {gearScore}
        </dd>
        <dt className="text-muted-foreground">В гильдии</dt>
        <dd>{formatTenure(player.joined_at) ?? "—"}</dd>
        <dt className="text-muted-foreground">Посещаемость</dt>
        <dd
          className={cn(
            "font-semibold",
            attendanceTone(player.attendancePercent).text,
          )}
        >
          {Math.round(player.attendancePercent)}% в этом месяце
        </dd>
      </dl>
    </div>
  );
}
