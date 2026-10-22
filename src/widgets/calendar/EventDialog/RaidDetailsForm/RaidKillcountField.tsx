"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { errorMessage } from "@/shared/lib/errorMessage";
import { Button, Input } from "@/shared/ui";
import { prepareRaidKillCount } from "@/widgets/killcount/api/scanner";
import type { KillCount, KillCountExclusion } from "@/widgets/killcount/types";
import { parseKillcountJson } from "@/widgets/killcount/ui/killcountModel";
import { exclusionsText, killcountSummary } from "./raidKillcountModel";

type Props = {
  rows: KillCount[];
  onChange: (rows: KillCount[]) => void;
};

export default function RaidKillcountField({ rows, onChange }: Props) {
  const [text, setText] = useState("");
  const [excluded, setExcluded] = useState<KillCountExclusion[]>([]);
  const [isChecking, setIsChecking] = useState(false);

  const handleTextChange = async (value: string) => {
    setText(value);
    const parsed = parseKillcountJson(value);
    if (!parsed) return;
    setIsChecking(true);
    try {
      const result = await prepareRaidKillCount(parsed);
      onChange(result.rows);
      setExcluded(result.excluded);
      setText("");
    } catch (error) {
      toast.error(errorMessage(error, "Не удалось проверить киллкаунт"));
    } finally {
      setIsChecking(false);
    }
  };

  const handleClear = () => {
    onChange([]);
    setExcluded([]);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-muted-foreground">
        Киллкаунт (тест)
      </span>
      <Input
        placeholder="Вставьте JSON киллкаунта из сканера"
        aria-label="JSON киллкаунта"
        value={text}
        disabled={isChecking}
        onChange={(event) => handleTextChange(event.target.value)}
      />
      {rows.length > 0 && (
        <div className="flex items-center gap-2 text-sm">
          <span className="flex-1">{killcountSummary(rows)}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Убрать киллкаунт"
            onClick={handleClear}
            className="cursor-pointer text-muted-foreground"
          >
            <X />
          </Button>
        </div>
      )}
      {excluded.length > 0 && (
        <p className="text-xs text-muted-foreground">
          Не вошли: {exclusionsText(excluded)}
        </p>
      )}
      <p className="text-xs text-muted-foreground">
        Виден только в этом рейде и никуда не засчитывается
      </p>
    </div>
  );
}
