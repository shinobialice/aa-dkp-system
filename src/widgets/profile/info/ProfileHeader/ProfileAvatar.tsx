import { useRef, useState, type ChangeEvent } from "react";
import { Camera } from "lucide-react";
import { toast } from "sonner";
import { uploadAvatar } from "@/actions/uploadAvatar";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui";
import { avatarSrc } from "@/shared/lib/format";
import { errorMessage } from "@/shared/lib/errorMessage";

type Props = {
  username: string;
  initialUrl: string | null;
  canUpload: boolean;
};

const ACCEPTED_TYPES = "image/png,image/jpeg,image/webp,image/gif";

export default function ProfileAvatar({
  username,
  initialUrl,
  canUpload,
}: Props) {
  const [avatarUrl, setAvatarUrl] = useState(initialUrl);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setUploading(true);
    try {
      const payload = new FormData();
      payload.append("file", file);
      setAvatarUrl(await uploadAvatar(payload));
      toast.success("Аватар обновлён");
    } catch (error) {
      toast.error(errorMessage(error, "Не удалось загрузить аватар"));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="relative size-17 shrink-0 sm:row-span-2 sm:size-24">
      <Avatar className="size-17 sm:size-24">
        <AvatarImage src={avatarSrc(username, avatarUrl)} alt={username} />
        <AvatarFallback className="text-2xl">
          {username.slice(0, 2)}
        </AvatarFallback>
      </Avatar>
      {canUpload && (
        <>
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            aria-label="Сменить аватар"
            className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/50 text-white opacity-0 transition-opacity hover:opacity-100 focus-visible:opacity-100 disabled:opacity-100"
          >
            <Camera className="size-6" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_TYPES}
            className="hidden"
            onChange={handleChange}
          />
        </>
      )}
    </div>
  );
}
