"use client";
import {
  getMyProfileStyleOptions,
  type ProfileStyle,
  type ProfileStyleOptions,
} from "@/actions/profileStyle";
import { useAsyncData } from "@/hooks/useAsyncData";
import { errorMessage } from "@/shared/lib/errorMessage";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Skeleton,
} from "@/shared/ui";
import ProfileStyleForm from "./ProfileStyleForm";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  username: string;
  avatarUrl: string | null;
  onSaved: (style: ProfileStyle) => void;
};

export default function ProfileStyleDialog({
  open,
  onOpenChange,
  username,
  avatarUrl,
  onSaved,
}: Props) {
  const { data, error } = useAsyncData(
    open ? "profile-style-options" : null,
    getMyProfileStyleOptions,
  );

  const handleSaved = (style: ProfileStyle) => {
    onSaved(style);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Оформление профиля</DialogTitle>
          <DialogDescription>
            Обложка, рамка аватара и эффект видны всем, кто откроет ваш профиль.
          </DialogDescription>
        </DialogHeader>
        <DialogBody
          options={data}
          error={error}
          username={username}
          avatarUrl={avatarUrl}
          onSaved={handleSaved}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}

function DialogBody({
  options,
  error,
  username,
  avatarUrl,
  onSaved,
  onCancel,
}: {
  options: ProfileStyleOptions | undefined;
  error: unknown;
  username: string;
  avatarUrl: string | null;
  onSaved: (style: ProfileStyle) => void;
  onCancel: () => void;
}) {
  if (error) {
    return (
      <p className="text-sm text-destructive">
        {errorMessage(error, "Не удалось загрузить варианты оформления")}
      </p>
    );
  }
  if (!options) return <Skeleton className="h-80 w-full" />;
  return (
    <ProfileStyleForm
      options={options}
      username={username}
      avatarUrl={avatarUrl}
      onSaved={onSaved}
      onCancel={onCancel}
    />
  );
}
