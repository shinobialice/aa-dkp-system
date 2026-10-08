import type { DiffTone } from "./compareModel";

export type BuildLetter = "A" | "B";

export const LETTER_CLASS: Record<BuildLetter, string> = {
  A: "bg-blue-700",
  B: "bg-orange-700",
};

export const DIFF_TONE_CLASS: Record<DiffTone, string> = {
  better: "text-green-700 dark:text-green-400",
  worse: "text-red-600 dark:text-red-400",
  same: "text-muted-foreground",
};
