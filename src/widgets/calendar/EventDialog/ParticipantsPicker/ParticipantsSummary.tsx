"use client";

import { useRef } from "react";
import { ImageUp, Loader2 } from "lucide-react";
import { Button } from "@/shared/ui";

type Props = {
  total: number;
  selectedCount: number;
  lateCount: number;
  ocrLoading: boolean;
  onFilesPick: (files: File[]) => void;
  onSelectAll: () => void;
  onClear: () => void;
};

export default function ParticipantsSummary({
  total,
  selectedCount,
  lateCount,
  ocrLoading,
  onFilesPick,
  onSelectAll,
  onClear,
}: Props) {
  const fileRef = useRef<HTMLInputElement>(null);
  const progress = total ? Math.round((selectedCount / total) * 100) : 0;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length > 0) onFilesPick(files);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex min-w-40 flex-1 flex-col gap-1">
        <span className="text-base font-bold">
          Участники{" "}
          <span className="text-green-700 dark:text-green-400">
            {selectedCount}
          </span>{" "}
          <span className="font-medium text-muted-foreground">из {total}</span>
          {lateCount > 0 && (
            <span className="text-xs font-medium whitespace-nowrap text-amber-700 dark:text-amber-400">
              {" "}
              · опоздали {lateCount}
            </span>
          )}
        </span>
        <span className="block h-[5px] overflow-hidden rounded-full bg-muted">
          <span
            className="block h-full rounded-full bg-green-600"
            style={{ width: `${progress}%` }}
          />
        </span>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={ocrLoading}
        onClick={() => fileRef.current?.click()}
        className="cursor-pointer"
      >
        {ocrLoading ? <Loader2 className="animate-spin" /> : <ImageUp />}
        Со скриншота
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onSelectAll}
        className="cursor-pointer"
      >
        Отметить всех
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        onClick={onClear}
        className="cursor-pointer"
      >
        Снять всех
      </Button>
    </div>
  );
}
