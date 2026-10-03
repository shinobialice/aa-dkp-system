import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { JournalEntry } from "../journalModel";

type Props = {
  entry: JournalEntry;
};

export default function EntryRecipient({ entry }: Props) {
  if (entry.kind === "drop") {
    return <span className="text-muted-foreground">на склад</span>;
  }
  if (entry.kind === "treasury") return null;

  return (
    <span className="inline-flex max-w-full min-w-0 items-center gap-1">
      <ArrowRight
        className="size-3.5 shrink-0 text-muted-foreground"
        aria-hidden
      />
      <RecipientName entry={entry} />
    </span>
  );
}

function RecipientName({ entry }: Props) {
  if (!entry.recipientId) {
    return (
      <span className="truncate font-medium">{entry.recipient ?? "—"}</span>
    );
  }
  return (
    <Link
      href={`/profile/${entry.recipientId}`}
      className="truncate font-medium hover:underline"
    >
      {entry.recipient}
    </Link>
  );
}
