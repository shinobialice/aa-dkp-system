import { useState } from "react";
import { Button } from "@/shared/ui";
import type { PickerUser } from "../eventFormModel";
import type { RaidScan } from "../raidScanModel";
import { lateSuggestion } from "./participantsModel";

type Props = {
  scan: RaidScan | null;
  users: PickerUser[];
  onAccept: (userIds: number[]) => void;
};

export default function LateSuggestion({ scan, users, onAccept }: Props) {
  const [answeredScan, setAnsweredScan] = useState<RaidScan | null>(null);
  if (!scan || answeredScan === scan) return null;

  const suggestion = lateSuggestion(scan, users);
  if (suggestion.ids.length === 0) return null;

  const handleAccept = () => {
    onAccept(suggestion.ids);
    setAnsweredScan(scan);
  };

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-500/30 dark:bg-amber-500/10 dark:text-amber-200">
      <span className="min-w-0 flex-1">{suggestion.text}</span>
      <Button
        type="button"
        size="sm"
        onClick={handleAccept}
        className="h-8 cursor-pointer"
      >
        Да
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={() => setAnsweredScan(scan)}
        className="h-8 cursor-pointer"
      >
        Нет
      </Button>
    </div>
  );
}
