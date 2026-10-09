"use client";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  deleteAvatarFrame,
  getAvatarFramesForAdmin,
} from "@/actions/avatarFrames";
import type { AvatarFrameRow } from "@/shared/lib/dbTypes";
import { describeFrameUnlock } from "@/shared/config/profileStyle";
import { useAsyncData } from "@/hooks/useAsyncData";
import { errorMessage } from "@/shared/lib/errorMessage";
import { AvatarFrame, Button } from "@/shared/ui";
import { Loading, SettingsCard } from "../settingsUi";
import AddFrameForm from "./AddFrameForm";

export default function AvatarFramesSettings() {
  const { data: frames, reload } = useAsyncData(
    "avatar-frames",
    getAvatarFramesForAdmin,
  );

  const handleDelete = async (frame: AvatarFrameRow) => {
    const question = `Удалить рамку «${frame.name}»? Она пропадёт у всех игроков.`;
    if (!confirm(question)) return;
    try {
      await deleteAvatarFrame(frame.id);
      toast.success("Рамка удалена");
      await reload();
    } catch (error) {
      toast.error(errorMessage(error, "Не удалось удалить рамку"));
    }
  };

  if (!frames) return <Loading />;

  return (
    <SettingsCard
      title="Рамки аватара"
      hint="PNG с прозрачностью 280×280, аватар — круг 200 px в центре"
    >
      <AddFrameForm onAdded={reload} />
      <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-3 lg:grid-cols-4">
        {frames.map((frame) => (
          <div
            key={frame.id}
            className="relative flex flex-col items-center gap-2 rounded-lg border px-2 pt-5 pb-3 text-center"
          >
            <AvatarFrame frameUrl={frame.image_url}>
              <span className="block size-16 rounded-full bg-muted" />
            </AvatarFrame>
            <span className="text-sm font-semibold">{frame.name}</span>
            <span className="text-xs text-muted-foreground">
              {describeFrameUnlock(
                frame.unlock_type,
                frame.unlock_value,
                frame.unlock_class,
              )}
            </span>
            <Button
              variant="ghost"
              size="icon"
              aria-label={`Удалить рамку «${frame.name}»`}
              onClick={() => handleDelete(frame)}
              className="absolute top-1 right-1 size-8 cursor-pointer"
            >
              <Trash2 />
            </Button>
          </div>
        ))}
        {frames.length === 0 && (
          <p className="col-span-full text-sm text-muted-foreground">
            Рамок пока нет.
          </p>
        )}
      </div>
    </SettingsCard>
  );
}
