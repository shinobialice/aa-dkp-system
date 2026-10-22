"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Radar } from "lucide-react";
import { toast } from "sonner";
import {
  dismissScannerRecord,
  publishScannerRecord,
} from "@/actions/scannerRecords";
import type { PendingRecord } from "@/server/killcountArena/types";
import { errorMessage } from "@/shared/lib/errorMessage";
import { formatNumber } from "@/shared/lib/format";
import { cn } from "@/shared/lib/tw-merge";
import { Button } from "@/shared/ui";
import { longDate } from "../../ui/killcountModel";
import FighterList from "./FighterList";
import {
  fightersText,
  KIND_LABEL,
  timeOf,
  totalKills,
} from "./killcountArenaModel";

type Props = {
  record: PendingRecord;
};

const ACTION_BUTTON =
  "arena-skew h-10 w-full rounded-none font-display tracking-wide uppercase";

export default function PendingRecordCard({ record }: Props) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [busy, setBusy] = useState<"publish" | "dismiss" | null>(null);
  const kills = totalKills(record.fighters);

  const run = async (
    action: "publish" | "dismiss",
    task: () => Promise<void>,
    done: string,
  ) => {
    setBusy(action);
    try {
      await task();
      toast.success(done);
      router.refresh();
    } catch (error) {
      toast.error(errorMessage(error, "Не получилось"));
    } finally {
      setBusy(null);
    }
  };

  return (
    <article
      aria-label="Запись из сканера"
      className="arena-cut relative grid grid-cols-[56px_minmax(0,1fr)] gap-x-4 gap-y-3 overflow-hidden border border-l-[3px] border-l-amber-500 bg-card p-4 md:grid-cols-[72px_minmax(0,1fr)_210px] md:gap-x-5 md:p-5"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-amber-500/10 to-transparent to-55%"
      />
      <ShieldIcon />
      <div className="relative min-w-0">
        <div className="flex flex-wrap items-baseline justify-between gap-x-3">
          <h3 className="font-display text-lg tracking-wide uppercase md:text-xl">
            Из сканера · {KIND_LABEL[record.kind]} {longDate(record.day)}
          </h3>
          <span className="font-display text-xs tracking-wide text-amber-600 uppercase dark:text-amber-400">
            Ждёт проверки
          </span>
        </div>
        <p className="mt-0.5 text-lg leading-tight font-extrabold md:text-xl">
          {formatNumber(kills)} килов · {fightersText(record.fighters.length)} ·{" "}
          {timeOf(record.window.startedAt)}–{timeOf(record.window.endedAt)}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Записал(а) {record.window.scannedBy} · в рейде было {record.inRaid}
          {record.kind === "prime" &&
            " · рейды привяжутся сами, когда секретарь внесёт посещение"}
        </p>
        <Notes record={record} />
      </div>
      <div className="relative col-span-2 flex flex-col gap-2 md:col-span-1">
        <Button
          className={ACTION_BUTTON}
          disabled={busy !== null || record.blockedReason !== null}
          onClick={() =>
            run(
              "publish",
              () => publishScannerRecord(record.id),
              "Киллкаунт опубликован",
            )
          }
        >
          {busy === "publish" && <Loader2 className="animate-spin" />}
          Опубликовать
        </Button>
        <Button
          variant="outline"
          className={ACTION_BUTTON}
          onClick={() => setIsExpanded((value) => !value)}
        >
          {isExpanded ? "Свернуть" : "Проверить"}
        </Button>
        <p className="text-center text-2xs text-muted-foreground">
          {record.kind === "prime"
            ? "после публикации уйдёт сообщение в ВК · "
            : ""}
          <button
            type="button"
            disabled={busy !== null}
            onClick={() =>
              run(
                "dismiss",
                () => dismissScannerRecord(record.id),
                "Запись убрана",
              )
            }
            className="cursor-pointer underline underline-offset-2"
          >
            удалить
          </button>
        </p>
      </div>
      {isExpanded && (
        <div className="relative col-span-full border">
          <FighterList
            fighters={record.fighters}
            sort="kills"
            window={record.window}
          />
        </div>
      )}
    </article>
  );
}

function ShieldIcon() {
  return (
    <div className="relative h-16 w-14 md:h-[82px] md:w-[72px]">
      <div className="arena-shield absolute inset-0 bg-amber-500" />
      <div className="arena-shield absolute inset-[3px] grid place-items-center bg-[radial-gradient(circle_at_50%_35%,#1f7a4a,#08160f)] text-white">
        <Radar className="-mt-2 size-7" />
      </div>
    </div>
  );
}

function Notes({ record }: { record: PendingRecord }) {
  return (
    <div className="mt-1.5 flex flex-col gap-1 text-xs">
      {record.blockedReason && (
        <p className="text-amber-700 dark:text-amber-400">
          {record.blockedReason}
        </p>
      )}
      {record.warnings.map((warning) => (
        <p key={warning} className="text-amber-700 dark:text-amber-400">
          {warning}
        </p>
      ))}
      {record.excluded.length > 0 && (
        <details className="text-muted-foreground">
          <summary className={cn("cursor-pointer")}>
            Не вошли: {record.excluded.length} (нет на сайте или не ДД-роль)
          </summary>
          <p className="mt-1">
            {record.excluded
              .map((item) => `${item.userName} — ${item.reason}`)
              .join(" · ")}
          </p>
        </details>
      )}
    </div>
  );
}
