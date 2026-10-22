"use client";

import { useRef, useState } from "react";
import { FileJson, Loader2 } from "lucide-react";
import {
  getScannerRaidRecords,
  type ScannerRaidRecord,
} from "@/actions/scannerRecords";
import { useAsyncData } from "@/hooks/useAsyncData";
import { formatDuration } from "@/shared/lib/format";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui";

type Props = {
  day: string;
  onImport: (text: string) => void;
};

const MINUTE_MS = 60_000;
const KIND_LABEL = { prime: "Прайм", agl: "АГЛ" };

export default function ScanRecordsMenu({ day, onImport }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const records = useAsyncData(isOpen ? `scanner-records:${day}` : null, () =>
    getScannerRaidRecords(day),
  );

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (file) onImport(await file.text());
  };

  return (
    <>
      <input
        ref={fileRef}
        type="file"
        accept=".json,application/json"
        className="hidden"
        onChange={handleFileChange}
      />
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="cursor-pointer"
          >
            <FileJson />
            Из сканера
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80">
          <DropdownMenuLabel>
            Записи сканера за {dayLabel(day)}
          </DropdownMenuLabel>
          <RecordItems
            records={records.data}
            isLoading={!records.data && !records.error}
            onPick={(record) => onImport(JSON.stringify(record.raid))}
          />
          <DropdownMenuSeparator />
          <DropdownMenuItem onSelect={() => fileRef.current?.click()}>
            Выбрать файл с компьютера…
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

function RecordItems({
  records,
  isLoading,
  onPick,
}: {
  records: ScannerRaidRecord[] | undefined;
  isLoading: boolean;
  onPick: (record: ScannerRaidRecord) => void;
}) {
  if (isLoading) {
    return (
      <DropdownMenuItem disabled>
        <Loader2 className="animate-spin" /> Загружаю…
      </DropdownMenuItem>
    );
  }
  if (!records || records.length === 0) {
    return (
      <DropdownMenuItem disabled>
        За этот день записей со сканера нет
      </DropdownMenuItem>
    );
  }
  return records.map((record) => (
    <DropdownMenuItem
      key={record.id}
      onSelect={() => onPick(record)}
      className="flex-col items-start gap-0.5"
    >
      <span className="font-semibold">
        {KIND_LABEL[record.kind]} · {record.startedAt.slice(11, 16)} –{" "}
        {record.endedAt.slice(11, 16)}
      </span>
      <span className="text-xs text-muted-foreground">
        {formatDuration(durationMinutes(record))} · {record.memberCount} чел. ·{" "}
        {record.scannedBy}
      </span>
    </DropdownMenuItem>
  ));
}

function durationMinutes(record: ScannerRaidRecord) {
  return Math.max(
    1,
    Math.round(
      (Date.parse(`${record.endedAt}+03:00`) -
        Date.parse(`${record.startedAt}+03:00`)) /
        MINUTE_MS,
    ),
  );
}

function dayLabel(day: string) {
  const [year, month, date] = day.split("-");
  return `${date}.${month}.${year}`;
}
