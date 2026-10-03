import { useState } from "react";
import { Button, Input } from "@/shared/ui";
import { todayIso } from "../giveawayModel";
import { type PlayerPanelActions } from "./playerPanelTypes";

export default function AddMiscGrantForm({
  onAdd,
}: {
  onAdd: PlayerPanelActions["onAddMiscGrant"];
}) {
  const [open, setOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const [comment, setComment] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(todayIso);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="cursor-pointer rounded-lg border border-dashed p-1.5 text-xs text-muted-foreground hover:bg-muted"
      >
        + Добавить выдачу
      </button>
    );
  }

  const submit = async () => {
    if (!comment.trim()) return;
    setPending(true);
    try {
      await onAdd({
        comment: comment.trim(),
        amount: amount ? Number(amount) : null,
        date,
      });
      setComment("");
      setAmount("");
      setOpen(false);
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="flex flex-col gap-1.5 rounded-lg border p-2">
      <Input
        placeholder="Что выдали"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        className="h-8 text-xs"
        autoFocus
      />
      <div className="flex items-center gap-1.5">
        <Input
          type="number"
          placeholder="Сумма"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="h-8 w-24 text-xs"
        />
        <input
          type="date"
          aria-label="Дата"
          className="h-8 flex-1 rounded-md border bg-background px-2 text-xs"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-1">
        <Button
          type="button"
          size="sm"
          className="h-7 cursor-pointer px-2 text-xs"
          disabled={!comment.trim() || pending}
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
