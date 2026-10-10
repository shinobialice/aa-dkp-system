import Link from "next/link";
import {
  Check,
  ListPlus,
  ListX,
  PackageCheck,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/shared/lib/tw-merge";
import { formatMoscowDateTime } from "@/shared/lib/format";
import type { UserNotification } from "@/actions/notifications";
import type { NotificationKind } from "@/shared/config/notifications";

type Props = {
  notification: UserNotification;
  isFresh: boolean;
  onNavigate: () => void;
};

const KIND_ICONS: Record<
  NotificationKind,
  { icon: LucideIcon; className: string }
> = {
  lootRequestApproved: {
    icon: Check,
    className:
      "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400",
  },
  lootRequestRejected: {
    icon: X,
    className: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-400",
  },
  lootQueueAdded: {
    icon: ListPlus,
    className:
      "bg-green-100 text-green-700 dark:bg-green-500/15 dark:text-green-400",
  },
  lootQueueRemoved: {
    icon: ListX,
    className: "bg-muted text-muted-foreground",
  },
  lootInStock: {
    icon: PackageCheck,
    className:
      "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400",
  },
};

export default function NotificationItem({
  notification,
  isFresh,
  onNavigate,
}: Props) {
  const { icon: Icon, className: iconClassName } =
    KIND_ICONS[notification.kind];
  const rowClassName = cn(
    "flex gap-3 px-4 py-3",
    isFresh && "bg-primary/5 dark:bg-primary/10",
  );
  const content = (
    <>
      <span
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-full",
          iconClassName,
        )}
      >
        <Icon className="size-4" />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-sm leading-snug break-words">
          {notification.message}
        </span>
        <span className="text-xs text-muted-foreground">
          {formatMoscowDateTime(notification.createdAt)}
        </span>
      </span>
      {isFresh && (
        <span className="mt-1.5 size-2 shrink-0 rounded-full bg-red-500" />
      )}
    </>
  );

  if (!notification.link) {
    return <li className={rowClassName}>{content}</li>;
  }

  return (
    <li>
      <Link
        href={notification.link}
        onClick={onNavigate}
        className={cn(rowClassName, "transition-colors hover:bg-muted")}
      >
        {content}
      </Link>
    </li>
  );
}
