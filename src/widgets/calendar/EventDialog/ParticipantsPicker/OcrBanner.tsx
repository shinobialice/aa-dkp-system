import { Loader2, ScanEye, X } from "lucide-react";
import { Button } from "@/shared/ui";
import type { OcrShot } from "./OcrScreenshotViewer/ocrModel";

type Props = {
  loading: boolean;
  error: string;
  shots: OcrShot[];
  isSelected: (username: string) => boolean;
  onReview: () => void;
  onDismiss: () => void;
};

export default function OcrBanner({
  loading,
  error,
  shots,
  isSelected,
  onReview,
  onDismiss,
}: Props) {
  if (loading) {
    return (
      <p className="flex items-center gap-2 rounded-lg bg-muted/60 px-3 py-2 text-sm text-muted-foreground">
        <Loader2 className="size-4 animate-spin" />
        Распознаю скриншоты…
      </p>
    );
  }
  if (error) {
    return (
      <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
        {error}
      </p>
    );
  }
  if (shots.length === 0) return null;

  const words = shots.flatMap((shot) => shot.words);
  const matchedNames = new Set(
    words.flatMap((word) => (word.match ? [word.match] : [])),
  );
  const marked = [...matchedNames].filter(isSelected).length;
  const unmatched = words.filter((word) => !word.match).length;
  const source =
    shots.length === 1 ? "скриншота" : `${shots.length} скриншотов`;

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-sm dark:border-blue-500/30 dark:bg-blue-500/10">
      <span className="min-w-0 flex-1 text-blue-900 dark:text-blue-200">
        <b>
          Со {source}: отмечено {marked}
        </b>
        {unmatched > 0 && ` · не найдено ${unmatched}`}
      </span>
      <Button
        type="button"
        size="sm"
        variant="outline"
        onClick={onReview}
        className="h-8 cursor-pointer border-blue-300 bg-white text-blue-900 hover:bg-blue-100 dark:border-blue-500/40 dark:bg-transparent dark:text-blue-200"
      >
        <ScanEye />
        Проверить на скриншоте
      </Button>
      <button
        type="button"
        aria-label="Скрыть"
        onClick={onDismiss}
        className="cursor-pointer text-blue-900/60 hover:text-blue-900 dark:text-blue-200/60"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
