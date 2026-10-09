import type { ProfileEffect } from "@/shared/config/profileStyle";
import { avatarSrc } from "@/shared/lib/format";
import { cn } from "@/shared/lib/tw-merge";
import { Avatar, AvatarFallback, AvatarFrame, AvatarImage } from "@/shared/ui";
import ProfileBackdrop from "../ProfileBackdrop";

type Props = {
  username: string;
  avatarUrl: string | null;
  coverUrl: string | null;
  frameUrl: string | null;
  effect: ProfileEffect | null;
};

export default function StylePreview({
  username,
  avatarUrl,
  coverUrl,
  frameUrl,
  effect,
}: Props) {
  const hasCover = coverUrl !== null;

  return (
    <div
      aria-label="Предпросмотр"
      className="relative overflow-hidden rounded-xl border bg-card p-4"
    >
      <ProfileBackdrop
        coverUrl={coverUrl}
        effect={effect}
        coverClassName="-mx-4 -mt-4 mb-3 h-24 sm:h-28"
      />
      <div className="flex items-end gap-4">
        <AvatarFrame
          frameUrl={frameUrl}
          className={cn("z-10", hasCover && "-mt-12")}
        >
          <Avatar className={cn("size-16", hasCover && "ring-4 ring-card")}>
            <AvatarImage src={avatarSrc(username, avatarUrl)} alt="" />
            <AvatarFallback>{username.slice(0, 2)}</AvatarFallback>
          </Avatar>
        </AvatarFrame>
        <span className="truncate pb-2 text-lg font-bold">{username}</span>
      </div>
    </div>
  );
}
