import { useId, useState } from "react";
import { Loader2, X } from "lucide-react";
import { Button, Textarea } from "@/shared/ui";
import { REJECT_REASON_MAX } from "./notificationCenterModel";

type Props = {
  isBusy: boolean;
  onSubmit: (reason: string) => void;
  onClose: () => void;
};

export default function RejectReasonForm({ isBusy, onSubmit, onClose }: Props) {
  const [reason, setReason] = useState("");
  const reasonId = useId();
  const isEmpty = reason.trim() === "";

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(reason);
      }}
      className="flex flex-col gap-2"
    >
      <label htmlFor={reasonId} className="text-xs text-muted-foreground">
        Причина отказа — игрок увидит её в уведомлении
      </label>
      <Textarea
        id={reasonId}
        autoFocus
        rows={2}
        maxLength={REJECT_REASON_MAX}
        value={reason}
        onChange={(event) => setReason(event.target.value)}
        placeholder="Почему не ставим в очередь?"
      />
      <div className="flex gap-2">
        <Button
          type="button"
          size="sm"
          variant="ghost"
          onClick={onClose}
          disabled={isBusy}
          className="flex-1 cursor-pointer"
        >
          Отмена
        </Button>
        <Button
          type="submit"
          size="sm"
          variant="destructive"
          disabled={isBusy || isEmpty}
          className="flex-1 cursor-pointer"
        >
          {isBusy ? <Loader2 className="animate-spin" /> : <X />}
          Отклонить
        </Button>
      </div>
    </form>
  );
}
