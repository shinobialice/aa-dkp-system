import type { ReactNode } from "react";
import Image from "next/image";
import type { ProfileUser } from "@/actions/getUser";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui";
import { avatarSrc } from "@/shared/lib/format";
import type { EquipmentSlot } from "../equipmentData";
import { CharacterPortraitUpload } from "../CharacterPortraitUpload";
import { LEFT_SLOTS, RIGHT_SLOTS, TOP_SLOTS } from "./slotLayout";

type Props = {
  userId: number;
  user: ProfileUser;
  portraitUrl: string | null;
  onPortraitChange: (url: string) => void;
  canEdit: boolean;
  renderSlot: (slot: EquipmentSlot, side: "left" | "right") => ReactNode;
};

export default function CharacterDoll({
  userId,
  user,
  portraitUrl,
  onPortraitChange,
  canEdit,
  renderSlot,
}: Props) {
  const upload = canEdit && (
    <CharacterPortraitUpload userId={userId} onUploaded={onPortraitChange} />
  );

  return (
    <div className="flex flex-col items-center">
      <div className="mb-3 flex justify-center">
        {TOP_SLOTS.map((slot) => renderSlot(slot, "left"))}
      </div>

      <div className="flex w-full items-stretch justify-center gap-2 sm:gap-3">
        <div className="flex flex-col gap-4 pl-8">
          {LEFT_SLOTS.map((slot) => renderSlot(slot, "left"))}
        </div>

        {portraitUrl && (
          <div className="relative flex w-40 flex-col rounded-xl border bg-muted/40 p-2 sm:w-60 @[60rem]:w-47.5">
            <div className="relative h-full w-full overflow-hidden rounded-lg">
              <Image
                src={portraitUrl}
                alt={user.username}
                fill
                unoptimized
                className="object-cover object-center"
              />
            </div>
            {upload}
          </div>
        )}
        {!portraitUrl && (
          <div className="relative flex w-32 flex-col items-center justify-center gap-2 rounded-xl border bg-muted/40 p-3 sm:w-52">
            <Avatar className="size-16 border-4 border-card shadow-sm sm:size-24">
              <AvatarImage
                src={avatarSrc(user.username, user.avatar_url)}
                alt={user.username}
              />
              <AvatarFallback className="text-xl">
                {user.username.slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="max-w-full truncate text-center text-sm font-medium">
              {user.username}
            </div>
            {upload}
          </div>
        )}

        <div className="flex flex-col gap-4 pr-8">
          {RIGHT_SLOTS.map((slot) => renderSlot(slot, "right"))}
        </div>
      </div>
    </div>
  );
}
