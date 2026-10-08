import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
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
  type SelectedBuffs,
} from "../characterBuffs";
import type { CharacterBuff } from "../itemsData/buffTypes";
import BuffOptionRow from "./BuffOptionRow";

type Props = {
  buffs: SelectedBuffs;
  choices: CharacterBuff[];
  onSave: (buffs: SelectedBuffs) => Promise<void>;
};

export default function CharacterBuffsDialog({
  buffs,
  choices,
  onSave,
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
      await onSave(draft);
      setOpen(false);
    } catch (error) {
      toast.error(errorMessage(error, "Не удалось сохранить баффы"));
    } finally {
      setSaving(false);
    }
  };

  const personalChoices = choices.filter((buff) => !buff.guild);
  const guildChoices = choices.filter((buff) => buff.guild);
  const description =
    guildChoices.length > 0
      ? "Включённые баффы учитываются в характеристиках"
      : "Включённые баффы учитываются в характеристиках. Гильдейские баффы настраивает администратор";

  const renderRow = (buff: CharacterBuff) => (
    <BuffOptionRow
      key={buff.id}
      buff={buff}
      value={draft[buff.id] ?? BUFF_OFF}
      available={isRequirementMet(buff, draft)}
      onChange={(value) => handleOptionChange(buff.id, value)}
    />
  );

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
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="max-h-[60vh] space-y-2 overflow-y-auto pr-1">
          {personalChoices.map(renderRow)}
          {guildChoices.length > 0 && (
            <div className="pt-3 pb-1 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              Гильдейские
            </div>
          )}
          {guildChoices.map(renderRow)}
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
