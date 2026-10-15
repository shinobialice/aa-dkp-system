import { avatarSrc } from "@/shared/lib/format";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui";
import { classColors } from "@/widgets/MembersTable/classStyles";
import type { Fighter } from "../warModel";

type Props = {
  fighter: Fighter;
};

export default function FighterAvatar({ fighter }: Props) {
  const color = fighter.userClass
    ? classColors[fighter.userClass]
    : "var(--border)";

  return (
    <Avatar
      className="size-9"
      style={{ boxShadow: `0 0 0 2px var(--card), 0 0 0 3.5px ${color}` }}
    >
      <AvatarImage src={avatarSrc(fighter.name, fighter.avatarUrl)} alt="" />
      <AvatarFallback className="text-2xs font-semibold">
        {fighter.name.slice(0, 2)}
      </AvatarFallback>
    </Avatar>
  );
}
