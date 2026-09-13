"use client";
import { useRef, useState } from "react";
import { Camera } from "lucide-react";
import { toast } from "sonner";
import { uploadCharacterPortrait } from "@/actions/uploadCharacterPortrait";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/shared/ui";

const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp"];

export function CharacterPortraitUpload({
  userId,
  onUploaded,
}: {
  userId: number;
  onUploaded: (url: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file: File) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error("Допустимы только изображения PNG, JPEG или WEBP");
      return;
    }
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const url = await uploadCharacterPortrait(userId, formData);
      onUploaded(url);
      toast.success("Скриншот сохранён");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Не удалось загрузить скриншот",
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="absolute top-1.5 right-1.5 z-10 flex size-7 cursor-pointer items-center justify-center rounded-md bg-background/80 text-muted-foreground backdrop-blur-sm transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Camera className="size-4" />
          <input
            ref={inputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = "";
            }}
          />
        </button>
      </TooltipTrigger>
      <TooltipContent
        side="top"
        className="dark w-56 border-border bg-background p-2 text-xs text-foreground"
      >
        Скриншот персонажа можно сделать в игре: Магазин → Изменение внешности
      </TooltipContent>
    </Tooltip>
  );
}
