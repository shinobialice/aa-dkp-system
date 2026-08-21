"use client";
import { useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/shared/ui";
import { Button, Checkbox, Label } from "@/shared/ui";
import { unlinkSocialAccount } from "@/actions/unlinkSocialAccount";
import {
  SOCIAL_PROVIDER_LABELS,
  type SocialProvider,
} from "@/shared/lib/socialProviders";

const PROVIDERS: SocialProvider[] = ["vk", "google", "mail"];

export default function SocialAccountsAdminPanel({
  user,
  onUnlinked,
}: {
  user: { id: number; vk_id?: string | null; google_id?: string | null; mail_id?: string | null };
  onUnlinked: (provider: SocialProvider) => void;
}) {
  const linkedProvider = PROVIDERS.find((provider) => {
    if (provider === "vk") return !!user.vk_id;
    if (provider === "google") return !!user.google_id;
    return !!user.mail_id;
  });

  const [pending, setPending] = useState(false);
  const [endSession, setEndSession] = useState(false);

  if (!linkedProvider) {
    return (
      <div className="text-sm text-muted-foreground">Нет привязанного аккаунта</div>
    );
  }

  const label = SOCIAL_PROVIDER_LABELS[linkedProvider];

  const handleUnlink = async () => {
    setPending(true);
    try {
      await unlinkSocialAccount(user.id, linkedProvider, endSession);
      onUnlinked(linkedProvider);
      toast.success(`${label} отвязан`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Не удалось отвязать аккаунт",
      );
    } finally {
      setPending(false);
      setEndSession(false);
    }
  };

  return (
    <AlertDialog
      onOpenChange={(open) => {
        if (!open) setEndSession(false);
      }}
    >
      <AlertDialogTrigger asChild>
        <Button
          size="sm"
          variant="outline"
          className="cursor-pointer"
          disabled={pending}
        >
          {label} · отвязать
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Отвязать {label}?</AlertDialogTitle>
          <AlertDialogDescription>
            Это единственный привязанный способ входа игрока — после отвязки
            он не сможет войти в аккаунт, пока не привяжет соцсеть заново.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex items-center gap-2 px-1 text-sm">
          <Checkbox
            id="end-session"
            className="cursor-pointer"
            checked={endSession}
            onCheckedChange={(checked) => setEndSession(checked === true)}
          />
          <Label htmlFor="end-session" className="cursor-pointer font-normal">
            Также завершить текущую сессию игрока
          </Label>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel className="cursor-pointer">
            Отмена
          </AlertDialogCancel>
          <AlertDialogAction className="cursor-pointer" onClick={handleUnlink}>
            Отвязать
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
