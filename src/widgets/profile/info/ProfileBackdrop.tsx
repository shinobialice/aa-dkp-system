import type { ProfileEffect } from "@/shared/config/profileStyle";
import { cn } from "@/shared/lib/tw-merge";
import ProfileEffectLayer from "./ProfileEffectLayer";

type Props = {
  coverUrl: string | null;
  effect: ProfileEffect | null;
  coverClassName: string;
};

export default function ProfileBackdrop({
  coverUrl,
  effect,
  coverClassName,
}: Props) {
  return (
    <>
      {coverUrl && (
        <div
          className={cn("relative overflow-hidden bg-muted", coverClassName)}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={coverUrl} alt="" className="size-full object-cover" />
          {effect && <ProfileEffectLayer effect={effect} />}
        </div>
      )}
      {effect && !coverUrl && <ProfileEffectLayer effect={effect} />}
    </>
  );
}
