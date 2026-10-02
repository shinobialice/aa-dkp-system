"use client";

import { FC, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button, Input } from "@/shared/ui";
import { KillCount } from "../../types";
import { setKillCountCurrent } from "../../api/current";
import { KillcountDay } from "../KillcountDay";

interface AddManualKillCountProps {
  onBack: () => void;
  isCanEdit: boolean;
}

/** JSON от парсера: в userName может быть "Ник (комментарий)". */
function parseJson(value: string): KillCount[] | null {
  try {
    const parsed: KillCount[] = JSON.parse(value);
    return parsed.map((item) => {
      const [userName = "", ...rest] = item.userName.split(" ");
      return {
        ...item,
        userName,
        comment: rest.join(" ").replaceAll(/\(|\)/g, ""),
      };
    });
  } catch (error) {
    console.error("Данные не сериализуемы", error);
    return null;
  }
}

export const AddManualKillCount: FC<AddManualKillCountProps> = ({
  onBack,
  isCanEdit,
}) => {
  const router = useRouter();
  const [rows, setRows] = useState<KillCount[]>([]);
  const [jsonInput, setJsonInput] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await setKillCountCurrent(rows);
      toast.success("Киллкаунт сохранён");
      router.refresh();
    } catch (error) {
      toast.error("Не удалось сохранить", {
        description: error instanceof Error ? error.message : undefined,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 rounded-xl border bg-card p-3 sm:flex-row sm:items-center">
        <Button variant="secondary" className="cursor-pointer" onClick={onBack}>
          Назад
        </Button>
        <Input
          // Напрямую вставляет данные в таблицу
          // Временное решение
          placeholder="Вставьте JSON"
          aria-label="JSON киллкаунта"
          value={jsonInput}
          onChange={(event) => {
            const value = event.currentTarget.value;
            setJsonInput(value);
            const parsed = parseJson(value);
            if (parsed) setRows(parsed);
          }}
        />
        <Button
          className="cursor-pointer"
          disabled={rows.length === 0 || saving}
          onClick={handleSave}
        >
          Сохранить
        </Button>
      </div>

      <KillcountDay
        data={rows}
        mode="draft"
        isCanEdit={isCanEdit}
        onDraftChange={setRows}
      />
    </div>
  );
};
