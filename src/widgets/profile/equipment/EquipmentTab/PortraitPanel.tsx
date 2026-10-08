import type { ReactNode } from "react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui";
import { avatarSrc } from "@/shared/lib/format";
import { cn } from "@/shared/lib/tw-merge";

type Props = {
  name: string;
  avatarUrl: string | null;
  roleClass: string | null;
  portraitUrl: string | null;
  upload: ReactNode;
  fallbackPortrait?: string;
  className?: string;
};

const PORTRAITS_DIR = "/images/equipment/portraits";

const CLASS_PORTRAITS: Record<string, string> = {
  Хил: `${PORTRAITS_DIR}/heal.webp`,
  Тактик: `${PORTRAITS_DIR}/tank.webp`,
  Танцор: `${PORTRAITS_DIR}/dancer.webp`,
  Лук: `${PORTRAITS_DIR}/archer.webp`,
  Маг: `${PORTRAITS_DIR}/mage.webp`,
  Бард: `${PORTRAITS_DIR}/bard.webp`,
  Милик: `${PORTRAITS_DIR}/melee.webp`,
  Стрелок: `${PORTRAITS_DIR}/gunner.webp`,
};

export default function PortraitPanel({
  name,
  avatarUrl,
  roleClass,
  portraitUrl,
  upload,
  fallbackPortrait,
  className,
}: Props) {
  const classPortrait = roleClass ? CLASS_PORTRAITS[roleClass] : undefined;
  const portrait = portraitUrl ?? classPortrait ?? fallbackPortrait;

  if (!portrait) {
    return (
      <div
        className={cn(
          "relative flex w-32 flex-col items-center justify-center gap-2 rounded-xl border bg-muted/40 p-3 sm:w-52",
          className,
        )}
      >
        <Avatar className="size-16 border-4 border-card shadow-sm sm:size-24">
          <AvatarImage src={avatarSrc(name, avatarUrl)} alt={name} />
          <AvatarFallback className="text-xl">
            {name.slice(0, 2)}
          </AvatarFallback>
        </Avatar>
        <div className="max-w-full truncate text-center text-sm font-medium">
          {name}
        </div>
        {upload}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "relative flex w-40 flex-col rounded-xl border bg-muted/40 p-2 sm:w-60 @[60rem]:w-47.5",
        className,
      )}
    >
      <div className="relative h-full w-full overflow-hidden rounded-lg">
        <Image
          src={portrait}
          alt={name}
          fill
          unoptimized
          className={cn(
            "object-center",
            portraitUrl ? "object-cover" : "object-contain",
          )}
        />
      </div>
      {upload}
    </div>
  );
}
