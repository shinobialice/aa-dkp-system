"use client";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Lock } from "lucide-react";
import { toast } from "sonner";
import type { ProfileUser } from "@/actions/getUser";
import type { InventoryItem } from "@/actions/getUserInventory";
import type { UserArchetype } from "@/actions/getUserArchetype";
import InventoryCategories from "@/widgets/profile/inventory/InventoryCategories";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui";
import { cn } from "@/shared/lib/tw-merge";
import { errorMessage } from "@/shared/lib/errorMessage";
import MainStep from "./MainStep";
import StepIndicator from "./StepIndicator";
import type { Step } from "./profileDraft";
import { saveProfile, type SavedProfile } from "./saveProfile";
import { useProfileForm } from "./useProfileForm";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: ProfileUser;
  archetype: UserArchetype;
  inventory: InventoryItem[];
  onInventoryChange: () => void;
  onSaved: (result: SavedProfile) => void;
  canEditNickname: boolean;
  canEditGs: boolean;
  canAddExtraRole: boolean;
  canEditArchetype: boolean;
  canEditVk: boolean;
  canEditJoinedAt: boolean;
  canEditInventory: boolean;
};

export default function ProfileEditDialog({
  open,
  onOpenChange,
  user,
  archetype,
  inventory,
  onInventoryChange,
  onSaved,
  canEditInventory,
  ...permissions
}: Props) {
  const [step, setStep] = useState<Step>("main");
  const [saving, setSaving] = useState(false);
  const form = useProfileForm(user, archetype, permissions);
  const hasLockedFields = [
    permissions.canEditNickname,
    permissions.canEditVk,
    permissions.canEditGs,
    permissions.canEditArchetype,
    permissions.canEditJoinedAt,
  ].includes(false);

  const handleSave = async () => {
    form.setSubmitted(true);
    if (form.hasErrors) {
      toast.error("Заполни обязательные поля");
      return;
    }

    setSaving(true);
    try {
      onSaved(
        await saveProfile({
          user,
          archetype,
          draft: form.draft,
          initial: form.initial,
          canEditNickname: permissions.canEditNickname,
          canEditArchetype: permissions.canEditArchetype,
          isRoleFilled: form.isRoleFilled,
        }),
      );
      form.markSaved();
      toast.success("Профиль сохранён");
      if (canEditInventory) setStep("inventory");
      else onOpenChange(false);
    } catch (error) {
      toast.error(errorMessage(error, "Не удалось сохранить профиль"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(next) => !saving && onOpenChange(next)}>
      <DialogContent
        className={cn(
          "flex max-h-[90vh] flex-col",
          step === "inventory" ? "sm:max-w-3xl" : "sm:max-w-2xl",
        )}
      >
        <DialogHeader>
          <DialogTitle>Редактировать профиль</DialogTitle>
          {canEditInventory && <StepIndicator step={step} />}
          {step === "main" && hasLockedFields && (
            <DialogDescription className="flex items-center gap-1.5">
              <Lock className="size-3.5 shrink-0" />
              Серые поля сейчас изменить нельзя — это настраивает администратор.
            </DialogDescription>
          )}
          {step === "inventory" && (
            <DialogDescription>
              Изменения инвентаря сохраняются сразу.
            </DialogDescription>
          )}
        </DialogHeader>

        <div className="-mx-6 min-h-0 flex-1 overflow-y-auto px-6">
          {step === "main" && (
            <MainStep form={form} permissions={permissions} />
          )}
          {step === "inventory" && (
            <InventoryCategories
              canEdit
              inventory={inventory}
              userId={user.id}
              onChange={onInventoryChange}
            />
          )}
        </div>

        <DialogFooter>
          {step === "main" && (
            <>
              <Button
                variant="ghost"
                className="cursor-pointer"
                disabled={saving}
                onClick={() => onOpenChange(false)}
              >
                Отмена
              </Button>
              <Button
                className="cursor-pointer"
                disabled={saving}
                onClick={handleSave}
              >
                {saveLabel(saving, canEditInventory)}
                {!saving && canEditInventory && <ArrowRight />}
              </Button>
            </>
          )}
          {step === "inventory" && (
            <>
              <Button
                variant="ghost"
                className="cursor-pointer"
                onClick={() => setStep("main")}
              >
                <ArrowLeft />
                Назад
              </Button>
              <Button
                className="cursor-pointer"
                onClick={() => onOpenChange(false)}
              >
                Готово
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function saveLabel(saving: boolean, hasNextStep: boolean) {
  if (saving) return "Сохранение...";
  return hasNextStep ? "Далее" : "Сохранить";
}
