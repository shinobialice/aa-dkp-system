"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { revokeScannerKey, type ScannerKey } from "@/actions/scannerLink";
import { errorMessage } from "@/shared/lib/errorMessage";
import { formatMoscowDateTime } from "@/shared/lib/format";
import { Button } from "@/shared/ui";

type Props = {
  keys: ScannerKey[];
};

export default function ConnectedScanners({ keys }: Props) {
  const router = useRouter();
  const [revokingId, setRevokingId] = useState<number | null>(null);

  const handleRevoke = async (keyId: number) => {
    setRevokingId(keyId);
    try {
      await revokeScannerKey(keyId);
      toast.success("Сканер отключён");
      router.refresh();
    } catch (error) {
      toast.error(errorMessage(error, "Не удалось отключить сканер"));
    } finally {
      setRevokingId(null);
    }
  };

  if (keys.length === 0) {
    return (
      <p className="text-muted-foreground">
        Подключённых сканеров нет. Нажмите «Подключить к сайту» в программе.
      </p>
    );
  }

  return (
    <ul className="divide-y">
      {keys.map((key) => (
        <li key={key.id} className="flex items-center gap-3 py-2">
          <span className="min-w-0 flex-1">
            <span className="block font-semibold">{key.label}</span>
            <span className="block text-xs text-muted-foreground">
              {lastUsedText(key.last_used_at)}
            </span>
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={revokingId === key.id}
            onClick={() => handleRevoke(key.id)}
            className="cursor-pointer"
          >
            Отключить
          </Button>
        </li>
      ))}
    </ul>
  );
}

function lastUsedText(lastUsedAt: string | null) {
  if (!lastUsedAt) return "ещё ничего не отправлял";
  return `последняя отправка ${formatMoscowDateTime(lastUsedAt)}`;
}
