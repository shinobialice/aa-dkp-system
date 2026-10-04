import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import saveCharacterBuffs from "@/actions/saveCharacterBuffs";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui";
import { errorMessage } from "@/shared/lib/errorMessage";
import {
  BUFF_OFF,
  isRequirementMet,
  PERSONAL_BUFFS,
  type SelectedBuffs,
} from "../characterBuffs";
import BuffOptionRow from "./BuffOptionRow";

type Props = {
  userId: number;
  buffs: SelectedBuffs;
  onChange: (buffs: SelectedBuffs) => void;
};

export default function CharacterBuffsDialog({
  userId,
  buffs,
  onChange,
}: Props) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(buffs);
  const [saving, setSaving] = useState(false);

  const handleOpenChange = (next: boolean) => {
    if (next) setDraft(buffs);
    setOpen(next);
  };

  const handleOptionChange = (buffId: number, value: string) => {
    setDraft((current) => {
      const next = { ...current };
      if (value === BUFF_OFF) delete next[buffId];
      else next[buffId] = value;
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await saveCharacterBuffs(userId, draft);
      onChange(draft);
      setOpen(false);
      toast.success("Баффы сохранены");
    } catch (error) {
      toast.error(errorMessage(error, "Не удалось сохранить баффы"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label="Баффы"
          className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-md border border-dashed text-muted-foreground hover:border-foreground hover:text-foreground"
        >
          <Plus className="size-4" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Баффы</DialogTitle>
          <DialogDescription>
            Включённые баффы учитываются в характеристиках и видны всем в
            профиле. Гильдейские баффы настраивает администратор
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] space-y-2 overflow-y-auto pr-1">
          {PERSONAL_BUFFS.map((buff) => (
            <BuffOptionRow
              key={buff.id}
              buff={buff}
              value={draft[buff.id] ?? BUFF_OFF}
              available={isRequirementMet(buff, draft)}
              onChange={(value) => handleOptionChange(buff.id, value)}
            />
          ))}
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            className="cursor-pointer"
            onClick={() => setOpen(false)}
            disabled={saving}
          >
            Отмена
          </Button>
          <Button
            className="cursor-pointer"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Сохранение..." : "Сохранить"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
