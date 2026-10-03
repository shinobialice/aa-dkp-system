import Image from "next/image";
import { avatarSrc } from "@/shared/lib/format";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui";
import type { Fighter } from "../warModel";

type Props = {
  fighter: Fighter;
};

export default function FighterAvatar({ fighter }: Props) {
  return (
    <span className="relative size-9 shrink-0">
      <Avatar className="size-9">
        <AvatarImage src={avatarSrc(fighter.name, fighter.avatarUrl)} alt="" />
        <AvatarFallback className="text-2xs font-semibold">
          {fighter.name.slice(0, 2)}
        </AvatarFallback>
      </Avatar>
      {fighter.rank && (
        <Image
          src={fighter.rank.icon}
          alt={fighter.rank.name}
          title={fighter.rank.name}
          width={22}
          height={22}
          className="absolute -right-1.5 -bottom-1.5 size-5.5 object-contain drop-shadow"
        />
      )}
    </span>
  );
}
