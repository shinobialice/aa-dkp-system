import { useState } from "react";
import { Hand, Hourglass, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/shared/ui";
import { errorMessage } from "@/shared/lib/errorMessage";
import {
  cancelLootQueueRequest,
  getMyLootQueueRequests,
  requestLootQueue,
  type MyLootQueueRequest,
  type MyLootQueueRequests,
} from "@/actions/lootQueueRequests";
import { formatQueueDate } from "../lootBuyModel";
import QueueRequestForm from "./QueueRequestForm";

type Props = {
  itemName: string;
  request: MyLootQueueRequest | null;
  onRequestsChange: (requests: MyLootQueueRequests) => void;
};

export default function QueueRequest({
  itemName,
  request,
  onRequestsChange,
}: Props) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isBusy, setIsBusy] = useState(false);

  const run = async (action: () => Promise<unknown>, fallback: string) => {
    setIsBusy(true);
    try {
      await action();
      onRequestsChange(await getMyLootQueueRequests());
      return true;
    } catch (error) {
      toast.error(errorMessage(error, fallback));
      return false;
    } finally {
      setIsBusy(false);
    }
  };

  const handleSubmit = async (comment: string) => {
    const isSent = await run(
      () => requestLootQueue(itemName, comment),
      "Не удалось отправить заявку",
    );
    if (!isSent) return;
    setIsFormOpen(false);
    toast.success("Заявка отправлена администраторам");
  };

  const handleCancel = (requestId: number) =>
    run(() => cancelLootQueueRequest(requestId), "Не удалось отозвать заявку");

  if (request?.status === "pending") {
    return (
      <PendingRequest
        createdAt={request.createdAt}
        isBusy={isBusy}
        onCancel={() => handleCancel(request.id)}
      />
    );
  }

  if (isFormOpen) {
    return (
      <QueueRequestForm
        isBusy={isBusy}
        onSubmit={handleSubmit}
        onClose={() => setIsFormOpen(false)}
      />
    );
  }

  return (
    <div className="mx-4 mt-2.5 flex flex-col gap-1.5">
      <Button className="cursor-pointer" onClick={() => setIsFormOpen(true)}>
        <Hand /> Хочу в очередь
      </Button>
      {request?.status === "rejected" && (
        <span className="text-center text-xs text-muted-foreground">
          Заявку от {formatQueueDate(request.createdAt)} отклонили
        </span>
      )}
    </div>
  );
}

function PendingRequest({
  createdAt,
  isBusy,
  onCancel,
}: {
  createdAt: string;
  isBusy: boolean;
  onCancel: () => void;
}) {
  return (
    <div className="mx-4 mt-2.5 flex items-center gap-2.5 rounded-lg bg-amber-50 px-3 py-2 text-amber-900 dark:bg-amber-500/10 dark:text-amber-200">
      <Hourglass className="size-4 shrink-0" />
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="text-sm font-semibold">
          Заявка отправлена {formatQueueDate(createdAt)}
        </span>
        <span className="text-xs">Ждёт решения администратора</span>
      </span>
      <Button
        variant="ghost"
        size="sm"
        onClick={onCancel}
        disabled={isBusy}
        className="shrink-0 cursor-pointer"
      >
        {isBusy && <Loader2 className="animate-spin" />}
        Отозвать
      </Button>
    </div>
  );
}
