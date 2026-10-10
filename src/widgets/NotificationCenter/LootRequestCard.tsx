import { useState } from "react";
import { Check, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage, Button } from "@/shared/ui";
import { avatarSrc, formatMoscowDateTime } from "@/shared/lib/format";
import { errorMessage } from "@/shared/lib/errorMessage";
import {
  approveLootQueueRequest,
  rejectLootQueueRequest,
  type PendingLootQueueRequest,
} from "@/actions/lootQueueRequestReview";
import PlayerHoverCard from "@/widgets/PlayerHoverCard";
import { LootIcon } from "@/widgets/Loot/LootBuy/icons/LootIconComponent";
import { notificationFeedStore } from "./notificationFeedStore";
import RejectReasonForm from "./RejectReasonForm";

type Props = {
  request: PendingLootQueueRequest;
};

type Decision = "approve" | "reject";

export default function LootRequestCard({ request }: Props) {
  const [decision, setDecision] = useState<Decision | null>(null);
  const [isRejecting, setIsRejecting] = useState(false);

  const decide = async (
    choice: Decision,
    action: () => Promise<void>,
    successText: string,
  ) => {
    setDecision(choice);
    try {
      await action();
      toast.success(successText);
    } catch (error) {
      toast.error(errorMessage(error, "Не удалось сохранить решение"));
    } finally {
      setDecision(null);
      await notificationFeedStore.refresh();
    }
  };

  const handleApprove = () =>
    decide(
      "approve",
      () => approveLootQueueRequest(request.id),
      `${request.username} теперь в очереди на «${request.itemName}»`,
    );

  const handleReject = (reason: string) =>
    decide(
      "reject",
      () => rejectLootQueueRequest(request.id, reason),
      `Заявка ${request.username} отклонена`,
    );

  const approveIcon =
    decision === "approve" ? <Loader2 className="animate-spin" /> : <Check />;

  const rejectForm = (
    <RejectReasonForm
      isBusy={decision === "reject"}
      onSubmit={handleReject}
      onClose={() => setIsRejecting(false)}
    />
  );

  const decisionButtons = (
    <div className="flex gap-2">
      <Button
        size="sm"
        onClick={handleApprove}
        disabled={decision !== null}
        className="flex-1 cursor-pointer"
      >
        {approveIcon}
        Принять
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setIsRejecting(true)}
        disabled={decision !== null}
        className="flex-1 cursor-pointer"
      >
        <X />
        Отклонить
      </Button>
    </div>
  );

  return (
    <li className="flex gap-3 px-4 py-3">
      <Avatar className="size-9 shrink-0">
        <AvatarImage
          src={avatarSrc(request.username, request.avatarUrl)}
          alt=""
        />
        <AvatarFallback>{request.username.slice(0, 1)}</AvatarFallback>
      </Avatar>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex flex-col gap-0.5">
          <p className="text-sm leading-snug">
            <PlayerHoverCard userId={request.userId}>
              <span className="font-semibold">{request.username}</span>
            </PlayerHoverCard>{" "}
            хочет в очередь
          </p>
          <span className="text-xs text-muted-foreground">
            {formatMoscowDateTime(request.createdAt)}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <LootIcon
            itemName={request.itemName}
            iconUrl={request.itemIcon}
            grade={request.itemGrade}
            size={28}
          />
          <span className="min-w-0 text-sm leading-tight font-medium">
            {request.itemName}
          </span>
        </div>
        {request.comment && (
          <p className="rounded-md bg-muted px-2.5 py-1.5 text-sm break-words whitespace-pre-line">
            {request.comment}
          </p>
        )}
        {isRejecting ? rejectForm : decisionButtons}
      </div>
    </li>
  );
}
