import { useState } from "react";
import { Button, Input } from "@/shared/ui";
import { type PlayerPanelActions } from "./playerPanelTypes";

export default function AddWishlistForm({
  onAdd,
}: {
  onAdd: PlayerPanelActions["onAddWishlistItem"];
}) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [itemName, setItemName] = useState("");
  const [comment, setComment] = useState("");

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="cursor-pointer rounded-lg border border-dashed p-1.5 text-xs text-muted-foreground hover:bg-muted"
      >
        + Добавить в хотелки
      </button>
    );
  }

  const submit = async () => {
    if (!itemName.trim()) return;
    setPending(true);
    try {
      await onAdd({ itemName: itemName.trim(), comment: comment.trim() });
      setItemName("");
      setComment("");
      setOpen(false);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex flex-col gap-1.5 rounded-lg border p-2">
      <Input
        placeholder="Название предмета"
        value={itemName}
        onChange={(e) => setItemName(e.target.value)}
        className="h-8 text-xs"
        autoFocus
      />
      <Input
        placeholder="Комментарий (необязательно)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="h-8 text-xs"
      />
      <div className="flex items-center gap-1">
        <Button
          type="button"
          size="sm"
          className="h-7 cursor-pointer px-2 text-xs"
          disabled={!itemName.trim() || pending}
          onClick={submit}
        >
          Добавить
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-7 cursor-pointer px-2 text-xs"
          onClick={() => setOpen(false)}
        >
          Отмена
        </Button>
      </div>
    </div>
  );
}
