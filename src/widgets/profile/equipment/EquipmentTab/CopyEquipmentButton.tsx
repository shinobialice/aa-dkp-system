import { useState } from "react";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import copyRoleEquipment from "@/actions/copyRoleEquipment";
import type { UserEquipment } from "@/actions/getUserEquipment";
import type { RoleSlot } from "@/shared/config/roleSlots";
import { errorMessage } from "@/shared/lib/errorMessage";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/ui";
import type { EquipmentCopySource } from "../equipmentRoles";

type Props = {
  userId: number;
  roleSlot: RoleSlot;
  sources: EquipmentCopySource[];
  onCopied: (equipment: UserEquipment[]) => void;
};

export default function CopyEquipmentButton({
  userId,
  roleSlot,
  sources,
  onCopied,
}: Props) {
  const [pending, setPending] = useState<EquipmentCopySource | null>(null);
  const [busy, setBusy] = useState(false);

  const handleConfirm = async () => {
    if (!pending) return;
    setBusy(true);
    try {
      onCopied(await copyRoleEquipment(userId, pending.roleSlot, roleSlot));
      toast.success("Экипировка скопирована");
      setPending(null);
    } catch (error) {
      toast.error(errorMessage(error, "Не удалось скопировать экипировку"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm" className="cursor-pointer">
            <Copy className="size-4" />
            Скопировать экипировку
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {sources.map((source) => (
            <DropdownMenuItem
              key={source.roleSlot}
              className="cursor-pointer"
              onSelect={() => setPending(source)}
            >
              С «{source.label}»
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog
        open={!!pending}
        onOpenChange={(open) => !open && !busy && setPending(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Скопировать экипировку с «{pending?.label}»?
            </AlertDialogTitle>
            <AlertDialogDescription>
              Вся экипировка этого класса заменится копией: предметы, грейды,
              заточка, гравировки, руны и синтез.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={busy}>Отмена</AlertDialogCancel>
            <AlertDialogAction
              disabled={busy}
              onClick={(event) => {
                event.preventDefault();
                handleConfirm();
              }}
            >
              Скопировать
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
