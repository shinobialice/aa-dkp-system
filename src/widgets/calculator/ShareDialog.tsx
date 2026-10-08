import { useState } from "react";
import { Copy, Link2 } from "lucide-react";
import { toast } from "sonner";
import { createCalculatorShare } from "@/actions/calculatorShare";
import { errorMessage } from "@/shared/lib/errorMessage";
import {
  Button,
  Checkbox,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
} from "@/shared/ui";
import { snapshotOf } from "./buildSnapshot";
import type { CalculatorBuild } from "./calculatorModel";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doll: CalculatorBuild;
  target: CalculatorBuild | null;
};

export default function ShareDialog({
  open,
  onOpenChange,
  doll,
  target,
}: Props) {
  const [withTarget, setWithTarget] = useState(true);
  const [link, setLink] = useState<string | null>(null);
  const [isCreating, setCreating] = useState(false);

  const handleOpenChange = (next: boolean) => {
    if (!next) setLink(null);
    onOpenChange(next);
  };

  const handleCreate = async () => {
    setCreating(true);
    try {
      const sharedTarget = withTarget ? target : null;
      const id = await createCalculatorShare(snapshotOf(doll, sharedTarget));
      setLink(`${window.location.origin}/calc/${id}`);
    } catch (error) {
      toast.error(errorMessage(error, "Не удалось создать ссылку"));
    } finally {
      setCreating(false);
    }
  };

  const handleCopy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success("Ссылка скопирована");
    } catch {
      toast.error("Не получилось скопировать, выделите ссылку вручную");
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Поделиться ссылкой</DialogTitle>
          <DialogDescription>
            Ссылка запоминает сборку такой, какая она сейчас. Открыть её могут
            только согильдийцы, и у каждого получится своя копия для правок.
          </DialogDescription>
        </DialogHeader>

        {target && !link && (
          <Label className="cursor-pointer font-normal">
            <Checkbox
              checked={withTarget}
              onCheckedChange={(checked) => setWithTarget(checked === true)}
            />
            Вместе со сравнением: {target.name}
          </Label>
        )}

        {link && (
          <div className="flex gap-2">
            <Input
              readOnly
              value={link}
              aria-label="Ссылка на сборку"
              onFocus={(event) => event.target.select()}
            />
            <Button className="cursor-pointer" onClick={() => handleCopy(link)}>
              <Copy />
              Скопировать
            </Button>
          </div>
        )}

        {!link && (
          <Button
            className="cursor-pointer self-end"
            disabled={isCreating}
            onClick={handleCreate}
          >
            <Link2 />
            {isCreating ? "Создаём…" : "Создать ссылку"}
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
