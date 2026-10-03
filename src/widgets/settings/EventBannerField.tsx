import { useRef, useState, type ChangeEvent } from "react";
import { toast } from "sonner";
import { getEventSettings, uploadEventBanner } from "@/actions/eventSettings";
import { useAsyncData } from "@/hooks/useAsyncData";
import { Button } from "@/shared/ui";
import { errorMessage } from "@/shared/lib/errorMessage";
import { SettingRow } from "./settingsUi";

const ACCEPTED_TYPES = "image/png,image/jpeg,image/webp,image/gif";

export default function EventBannerField() {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: settings, reload } = useAsyncData(
    "event-banner",
    getEventSettings,
  );
  const imageUrl = settings?.imageUrl ?? null;

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setUploading(true);
    try {
      const payload = new FormData();
      payload.append("file", file);
      await uploadEventBanner(payload);
      toast.success("Картинка загружена");
      await reload();
    } catch (error) {
      toast.error(errorMessage(error, "Не удалось загрузить картинку"));
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <SettingRow
        title="Картинка баннера"
        hint="Загружается сразу. Лучше широкая, примерно 1568×120: баннер тянется на всю ширину и обрезается по высоте"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_TYPES}
          className="hidden"
          onChange={handleChange}
        />
        <Button
          variant="outline"
          size="sm"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
          className="cursor-pointer"
        >
          {uploadLabel(uploading, !!imageUrl)}
        </Button>
      </SettingRow>
      {imageUrl && (
        <div className="px-4 py-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={imageUrl}
            alt="Текущий баннер"
            className="h-20 w-full rounded-md object-cover"
          />
        </div>
      )}
    </>
  );
}

function uploadLabel(uploading: boolean, hasImage: boolean) {
  if (uploading) return "Загрузка…";
  return hasImage ? "Заменить картинку" : "Загрузить картинку";
}
