"use client";
import { useState } from "react";
import { Palette, Pencil } from "lucide-react";
import type { ProfileUser } from "@/actions/getUser";
import type { ProfileStyle } from "@/actions/profileStyle";
import type { SocialProvider } from "@/shared/lib/socialProviders";
import { Button } from "@/shared/ui";
import SocialAccountsAdminPanel from "../SocialAccountsAdminPanel";
import ProfileStyleDialog from "../ProfileStyleDialog";

type Props = {
  user: ProfileUser;
  isAdmin: boolean;
  isOwnProfile: boolean;
  canEditProfile: boolean;
  onEdit: () => void;
  onSocialUnlinked: (provider: SocialProvider) => void;
  onStyleSaved: (style: ProfileStyle) => void;
};

export default function ProfileHeaderActions({
  user,
  isAdmin,
  isOwnProfile,
  canEditProfile,
  onEdit,
  onSocialUnlinked,
  onStyleSaved,
}: Props) {
  const [styleOpen, setStyleOpen] = useState(false);
  const [styleSession, setStyleSession] = useState(0);

  const handleStyleOpen = () => {
    setStyleSession((session) => session + 1);
    setStyleOpen(true);
  };

  return (
    <div className="flex flex-col items-end gap-2 self-start sm:row-span-2 sm:flex-row sm:items-center">
      {isAdmin && (
        <div className="max-sm:hidden">
          <SocialAccountsAdminPanel user={user} onUnlinked={onSocialUnlinked} />
        </div>
      )}
      {isOwnProfile && (
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer max-sm:size-11 max-sm:p-0"
          onClick={handleStyleOpen}
          aria-label="Оформление профиля"
        >
          <Palette />
          <span className="max-sm:hidden">Оформление</span>
        </Button>
      )}
      {canEditProfile && (
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer max-sm:size-11 max-sm:p-0"
          onClick={onEdit}
          aria-label="Редактировать профиль"
        >
          <Pencil />
          <span className="max-sm:hidden">Редактировать</span>
        </Button>
      )}
      {isOwnProfile && (
        <ProfileStyleDialog
          key={styleSession}
          open={styleOpen}
          onOpenChange={setStyleOpen}
          username={user.username}
          avatarUrl={user.avatar_url}
          onSaved={onStyleSaved}
        />
      )}
    </div>
  );
}
