"use client";

import { useState } from "react";
import { cn } from "@/shared/lib/tw-merge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/shared/ui";
import { shotStats, type OcrShot } from "./ocrModel";
import ShotCanvas from "./ShotCanvas";
import ShotLegend from "./ShotLegend";
import UnmatchedWordList from "./UnmatchedWordList";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shots: OcrShot[];
  userNames: string[];
  isSelected: (username: string) => boolean;
  onToggle: (username: string) => void;
  onAssign: (shotIndex: number, wordIndex: number, username: string) => void;
};

export default function OcrScreenshotViewer({
  open,
  onOpenChange,
  shots,
  userNames,
  isSelected,
  onToggle,
  onAssign,
}: Props) {
  const [active, setActive] = useState(0);
  const shotIndex = Math.min(active, shots.length - 1);
  const shot = shots[shotIndex];
  if (!shot) return null;

  const stats = shotStats(shot, isSelected);
  const handleAssign = (wordIndex: number, username: string) =>
    onAssign(shotIndex, wordIndex, username);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex h-[100dvh] max-h-[100dvh] w-full max-w-none flex-col gap-0 overflow-hidden rounded-none p-0 sm:h-[92dvh] sm:max-w-6xl sm:rounded-2xl">
        <div className="flex shrink-0 flex-col gap-2 border-b px-5 py-3.5 pr-12">
          <DialogTitle className="text-lg">Проверка скриншота</DialogTitle>
          <DialogDescription asChild>
            <ShotLegend
              marked={stats.marked}
              unmarked={stats.unmarked}
              unmatched={stats.unmatched.length}
            />
          </DialogDescription>
          {shots.length > 1 && (
            <div role="tablist" className="flex flex-wrap gap-1">
              {shots.map((item, index) => (
                <button
                  key={item.url}
                  type="button"
                  role="tab"
                  aria-selected={index === shotIndex}
                  onClick={() => setActive(index)}
                  className={cn(
                    "h-8 cursor-pointer rounded-md px-3 text-sm font-semibold transition-colors",
                    index === shotIndex
                      ? "bg-foreground text-background"
                      : "bg-muted text-muted-foreground hover:text-foreground",
                  )}
                >
                  Скриншот {index + 1}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,1fr)_260px]">
          <ShotCanvas
            shot={shot}
            shotIndex={shotIndex}
            userNames={userNames}
            isSelected={isSelected}
            onToggle={onToggle}
            onAssign={handleAssign}
          />
          <UnmatchedWordList
            words={stats.unmatched}
            userNames={userNames}
            onAssign={handleAssign}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
