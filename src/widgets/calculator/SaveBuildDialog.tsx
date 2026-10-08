import { useState, type FormEvent } from "react";
import { Save } from "lucide-react";
import { toast } from "sonner";
import { errorMessage } from "@/shared/lib/errorMessage";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
} from "@/shared/ui";
import type { TrackedBuild } from "./calculatorModel";
import { MAX_BUILD_NAME_LENGTH } from "./snapshotSchema";

type Props = {
  tracked: TrackedBuild;
  onSave: (name: string, asNew: boolean) => Promise<void>;
  onDelete: (savedId: number) => Promise<void>;
};

export default function SaveBuildDialog({ tracked, onSave, onDelete }: Props) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(tracked.current.name);
  const [isBusy, setBusy] = useState(false);
  const [isConfirmingDelete, setConfirmingDelete] = useState(false);
  const { savedId } = tracked;
  const trimmedName = name.trim();

  const handleOpenChange = (next: boolean) => {
    if (next) {
      setName(tracked.current.name);
      setConfirmingDelete(false);
    }
    setOpen(next);
  };

  const run = async (action: () => Promise<void>, success: string) => {
    setBusy(true);
    try {
      await action();
      toast.success(success);
      setOpen(false);
    } catch (error) {
      toast.error(errorMessage(error, "Не удалось сохранить куклу"));
    } finally {
      setBusy(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    run(() => onSave(trimmedName, false), "Кукла сохранена");
  };

  const handleDelete = () => {
    if (savedId === null) return;
    if (!isConfirmingDelete) {
      setConfirmingDelete(true);
      return;
    }
    run(() => onDelete(savedId), "Кукла удалена");
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer"
          aria-label="Сохранить куклу"
          title="Сохранить куклу"
        >
          <Save />
          <span className="hidden sm:inline">Сохранить</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Сохранить куклу</DialogTitle>
            <DialogDescription>
              Кукла попадёт в список «Мои куклы» в меню калькулятора. Её видите
              только вы, в профиле она не показывается
            </DialogDescription>
          </DialogHeader>
          <Label className="flex-col items-start gap-1.5">
            Название
            <Input
              value={name}
              onChange={(event) => setName(event.target.value)}
              onFocus={(event) => event.target.select()}
              maxLength={MAX_BUILD_NAME_LENGTH}
              placeholder="Например: Хил на осаду"
              autoFocus
            />
          </Label>
          <DialogFooter className="gap-2 sm:justify-between">
            <DeleteButton
              savedId={savedId}
              isConfirming={isConfirmingDelete}
              disabled={isBusy}
              onClick={handleDelete}
            />
            <div className="flex flex-col-reverse gap-2 sm:flex-row">
              {savedId !== null && (
                <Button
                  type="button"
                  variant="outline"
                  className="cursor-pointer"
                  disabled={isBusy || !trimmedName}
                  onClick={() =>
                    run(
                      () => onSave(trimmedName, true),
                      "Сохранена новая кукла",
                    )
                  }
                >
                  Сохранить как новую
                </Button>
              )}
              <Button
                type="submit"
                className="cursor-pointer"
                disabled={isBusy || !trimmedName}
              >
                Сохранить
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

type DeleteButtonProps = {
  savedId: number | null;
  isConfirming: boolean;
  disabled: boolean;
  onClick: () => void;
};

function DeleteButton({
  savedId,
  isConfirming,
  disabled,
  onClick,
}: DeleteButtonProps) {
  if (savedId === null) return <span className="hidden sm:block" />;
  return (
    <Button
      type="button"
      variant="ghost"
      className="cursor-pointer text-destructive hover:text-destructive"
      disabled={disabled}
      onClick={onClick}
    >
      {isConfirming ? "Точно удалить?" : "Удалить"}
    </Button>
  );
}
