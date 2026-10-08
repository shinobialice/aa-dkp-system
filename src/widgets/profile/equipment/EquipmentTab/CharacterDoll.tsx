import type { ReactNode } from "react";
import type { ProfileUser } from "@/actions/getUser";
import type { EquipmentSlot } from "../equipmentData";
import { CharacterPortraitUpload } from "../CharacterPortraitUpload";
import { LEFT_SLOTS, RIGHT_SLOTS, TOP_SLOTS } from "./slotLayout";
import PortraitPanel from "./PortraitPanel";

type Props = {
  userId: number;
  user: ProfileUser;
  roleClass: string | null;
  portraitUrl: string | null;
  onPortraitChange: (url: string) => void;
  canEdit: boolean;
  renderSlot: (slot: EquipmentSlot, side: "left" | "right") => ReactNode;
};

export default function CharacterDoll({
  userId,
  user,
  roleClass,
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

        <PortraitPanel
          name={user.username}
          avatarUrl={user.avatar_url}
          roleClass={roleClass}
          portraitUrl={portraitUrl}
          upload={upload}
        />

        <div className="flex flex-col gap-4 pr-8">
          {RIGHT_SLOTS.map((slot) => renderSlot(slot, "right"))}
        </div>
      </div>
    </div>
  );
}
