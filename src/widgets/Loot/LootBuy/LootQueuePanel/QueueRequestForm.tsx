import { useId, useState } from "react";
import { Loader2, Send } from "lucide-react";
import { Button, Textarea } from "@/shared/ui";
import { QUEUE_REQUEST_COMMENT_MAX } from "../lootBuyModel";

type Props = {
  isBusy: boolean;
  onSubmit: (comment: string) => void;
  onClose: () => void;
};

export default function QueueRequestForm({ isBusy, onSubmit, onClose }: Props) {
  const [comment, setComment] = useState("");
  const commentId = useId();

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit(comment);
      }}
      className="mx-4 mt-2.5 flex flex-col gap-2 rounded-lg border p-3"
    >
      <label htmlFor={commentId} className="text-sm font-semibold">
        Заявка в очередь
      </label>
      <Textarea
        id={commentId}
        autoFocus
        rows={3}
        maxLength={QUEUE_REQUEST_COMMENT_MAX}
        value={comment}
        onChange={(event) => setComment(event.target.value)}
        placeholder="Зачем вам этот предмет?"
      />
      <span className="text-xs text-muted-foreground">
        Димониш рассмотрит заявку и поставит вас в очередь или откажет
      </span>
      <div className="flex justify-end gap-2">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="cursor-pointer"
        >
          Отмена
        </Button>
        <Button
          type="submit"
          size="sm"
          disabled={isBusy}
          className="cursor-pointer"
        >
          {isBusy ? <Loader2 className="animate-spin" /> : <Send />}
          Отправить
        </Button>
      </div>
    </form>
  );
}
