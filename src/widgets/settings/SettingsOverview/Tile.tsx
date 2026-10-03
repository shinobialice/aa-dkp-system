import type { ReactNode } from "react";
import { cn } from "@/shared/lib/tw-merge";
import { formatMoscowDateTime } from "@/shared/lib/format";
import { sectionById, type SectionId } from "../settingsSections";

export type Tone = "ok" | "warn" | "red" | "muted";

export type Pill = { tone: Tone; text: string };

const TONE: Record<Tone, string> = {
  ok: "bg-green-100 text-green-800 dark:bg-green-500/15 dark:text-green-300",
  warn: "bg-amber-100 text-amber-800 dark:bg-amber-500/15 dark:text-amber-300",
  red: "bg-red-100 text-red-700 dark:bg-red-500/15 dark:text-red-300",
  muted: "bg-muted text-muted-foreground",
};

type Props = {
  section: SectionId;
  value: ReactNode;
  pill?: Pill;
  hint?: string;
  onOpen: (id: SectionId) => void;
};

export default function Tile({ section, value, pill, hint, onOpen }: Props) {
  const meta = sectionById(section);
  return (
    <button
      type="button"
      onClick={() => onOpen(section)}
      className="flex min-w-0 cursor-pointer flex-col items-start gap-1.5 rounded-xl border bg-card px-3.5 py-3 text-left transition-colors hover:border-foreground/25"
    >
      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <meta.icon className="size-3.5" />
        {meta.label}
      </span>
      <span className="text-base leading-snug font-semibold">
        {value ?? <span className="text-muted-foreground">…</span>}
      </span>
      {pill && (
        <span
          className={cn(
            "rounded-full px-2 py-px text-2xs font-semibold",
            TONE[pill.tone],
          )}
        >
          {pill.text}
        </span>
      )}
      {hint && <span className="text-xs text-muted-foreground">{hint}</span>}
    </button>
  );
}

export function shortDate(iso: string) {
  return formatMoscowDateTime(iso).slice(0, 5);
}
