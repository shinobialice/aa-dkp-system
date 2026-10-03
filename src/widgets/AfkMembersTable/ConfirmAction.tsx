import { useState } from "react";
import { Button } from "@/shared/ui";

export default function ConfirmAction({
  label,
  question,
  onConfirm,
}: {
  label: string;
  question: string;
  onConfirm: () => Promise<void>;
}) {
  const [asking, setAsking] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!asking) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="cursor-pointer"
        onClick={() => setAsking(true)}
      >
        {label}
      </Button>
    );
  }
  return (
    <span className="inline-flex gap-1.5">
      <Button
        size="sm"
        className="cursor-pointer"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          try {
            await onConfirm();
          } finally {
            setBusy(false);
            setAsking(false);
          }
        }}
      >
        {busy ? "…" : question}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="cursor-pointer"
        disabled={busy}
        onClick={() => setAsking(false)}
      >
        Нет
      </Button>
    </span>
  );
}
