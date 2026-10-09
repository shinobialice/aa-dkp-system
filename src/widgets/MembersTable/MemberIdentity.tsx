import Link from "next/link";
import PlayerHoverCard from "@/widgets/PlayerHoverCard";
import { Avatar, AvatarFallback, AvatarFrame, AvatarImage } from "@/shared/ui";
import { cn } from "@/shared/lib/tw-merge";
import type { Member } from "./membersModel";
import { avatarSrc, vkProfileUrl } from "@/shared/lib/format";

export default function MemberIdentity({
  member,
  size,
}: {
  member: Member;
  size: "sm" | "lg";
}) {
  const href = vkProfileUrl(member.vk_name, member.vk_id);
  return (
    <div className="flex min-w-0 items-center gap-2.5">
      <AvatarFrame frameUrl={member.avatar_frame_url}>
        <Avatar className={cn(size === "sm" ? "size-8" : "size-10")}>
          <AvatarImage
            src={avatarSrc(member.username, member.avatar_url)}
            alt={member.username}
          />
          <AvatarFallback className="text-2xs">
            {member.username.slice(0, 2)}
          </AvatarFallback>
        </Avatar>
      </AvatarFrame>
      <div className="min-w-0">
        <PlayerHoverCard userId={member.id}>
          <Link
            href={`/profile/${member.id}`}
            className="block truncate font-semibold hover:underline"
          >
            {member.username}
          </Link>
        </PlayerHoverCard>
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="block truncate text-xs text-muted-foreground hover:text-foreground hover:underline"
          >
            {member.vk_real_name ?? "ВК"}
          </a>
        ) : (
          <span className="block text-xs text-muted-foreground">
            ВК не привязан
          </span>
        )}
      </div>
    </div>
  );
}
