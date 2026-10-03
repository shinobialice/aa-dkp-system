import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui";
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
      <Avatar className={cn("shrink-0", size === "sm" ? "size-8" : "size-10")}>
        <AvatarImage
          src={avatarSrc(member.username, member.avatar_url)}
          alt={member.username}
        />
        <AvatarFallback className="text-2xs">
          {member.username.slice(0, 2)}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <Link
          href={`/profile/${member.id}`}
          className="block truncate font-semibold hover:underline"
        >
          {member.username}
        </Link>
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
