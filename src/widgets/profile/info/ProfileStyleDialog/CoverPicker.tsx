"use client";
import { useRef, useState, type ChangeEvent } from "react";
import { ImageOff, Upload } from "lucide-react";
import { toast } from "sonner";
import { uploadMyProfileCover } from "@/actions/profileStyle";
import type { ProfileCoverRow } from "@/shared/lib/dbTypes";
import { errorMessage } from "@/shared/lib/errorMessage";
import { cn } from "@/shared/lib/tw-merge";

type Props = {
  covers: ProfileCoverRow[];
  value: string | null;
  onChange: (coverUrl: string | null) => void;
};

const ACCEPTED_TYPES = "image/png,image/jpeg,image/webp,image/gif";

export default function CoverPicker({ covers, value, onChange }: Props) {
  const [ownUrl, setOwnUrl] = useState(() => ownCoverUrl(covers, value));
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setIsUploading(true);
    try {
      const payload = new FormData();
      payload.append("file", file);
      const url = await uploadMyProfileCover(payload);
      setOwnUrl(url);
      onChange(url);
    } catch (error) {
      toast.error(errorMessage(error, "Не удалось загрузить картинку"));
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        <CoverOption
          label="Без обложки"
          isSelected={value === null}
          onSelect={() => onChange(null)}
        />
        {ownUrl && (
          <CoverOption
            label="Своя картинка"
            imageUrl={ownUrl}
            isSelected={value === ownUrl}
            onSelect={() => onChange(ownUrl)}
          />
        )}
        {covers.map((cover) => (
          <CoverOption
            key={cover.id}
            imageUrl={cover.image_url}
            isSelected={value === cover.image_url}
            onSelect={() => onChange(cover.image_url)}
          />
        ))}
        <button
          type="button"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          className="flex h-20 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed text-sm text-muted-foreground hover:text-foreground disabled:cursor-default"
        >
          <Upload className="size-4" />
          {isUploading ? "Загрузка…" : "Загрузить свою"}
        </button>
      </div>
      <p className="text-xs text-muted-foreground">
        Лучше широкая картинка, примерно 1600×300. Её покажут над шапкой
        профиля.
      </p>
      <input
        ref={fileInputRef}
        type="file"
        accept={ACCEPTED_TYPES}
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}

function CoverOption({
  label,
  imageUrl,
  isSelected,
  onSelect,
}: {
  label?: string;
  imageUrl?: string;
  isSelected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={isSelected}
      aria-label={label ?? "Обложка"}
      onClick={onSelect}
      className={cn(
        "relative flex h-20 cursor-pointer items-center justify-center gap-1.5 overflow-hidden rounded-lg border bg-muted text-sm text-muted-foreground",
        isSelected && "border-primary ring-2 ring-primary/40",
      )}
    >
      <CoverOptionContent label={label} imageUrl={imageUrl} />
    </button>
  );
}

function CoverOptionContent({
  label,
  imageUrl,
}: {
  label?: string;
  imageUrl?: string;
}) {
  if (!imageUrl) {
    return (
      <>
        <ImageOff className="size-4" />
        {label}
      </>
    );
  }
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={imageUrl} alt="" className="size-full object-cover" />
      {label && (
        <span className="absolute bottom-1 left-1 rounded bg-black/60 px-1.5 text-xs text-white">
          {label}
        </span>
      )}
    </>
  );
}

function ownCoverUrl(covers: ProfileCoverRow[], value: string | null) {
  if (value === null) return null;
  return covers.some((cover) => cover.image_url === value) ? null : value;
}
