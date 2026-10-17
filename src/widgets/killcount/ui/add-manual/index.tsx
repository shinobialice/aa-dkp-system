"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Input,
} from "@/shared/ui";
import { type KillCount } from "../../types";
import {
  findUnknownKillCountUsers,
  setKillCountCurrent,
} from "../../api/current";
import { KillcountDay } from "../KillcountDay";

type AddManualKillCountProps = {
  onBack: () => void;
  isCanEdit: boolean;
};

function parseJson(value: string): KillCount[] | null {
  try {
    const parsed: KillCount[] = JSON.parse(value);
    return parsed.map((item) => {
      const [userName = "", ...rest] = item.userName.split(" ");
      return {
        ...item,
        userName,
        // «Ник (комментарий)» — старый способ; JSON сканера передаёт comment отдельно.
        comment: rest.length
          ? rest.join(" ").replaceAll(/\(|\)/g, "")
          : item.comment,
      };
    });
  } catch (error) {
    console.error("Данные не сериализуемы", error);
    return null;
  }
}

export function AddManualKillCount({
  onBack,
  isCanEdit,
}: AddManualKillCountProps) {
  const router = useRouter();
  const [rows, setRows] = useState<KillCount[]>([]);
  const [jsonInput, setJsonInput] = useState("");
  const [saving, setSaving] = useState(false);
  const [unknownNames, setUnknownNames] = useState<string[]>([]);

  const namesKey = rows.map((row) => row.userName).join("\n");
  useEffect(() => {
    const names = namesKey ? namesKey.split("\n") : [];
    let ignore = false;
    (names.length ? findUnknownKillCountUsers(names) : Promise.resolve([]))
      .then((unknown) => {
        if (!ignore) setUnknownNames(unknown);
      })
      // Проверка — только подсказка: если она не удалась, ошибку покажет сохранение.
      .catch(() => {
        if (!ignore) setUnknownNames([]);
      });
    return () => {
      ignore = true;
    };
  }, [namesKey]);

  const removeUnknown = () => {
    setRows(rows.filter((row) => !unknownNames.includes(row.userName)));
  };

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
          disabled={rows.length === 0 || saving || unknownNames.length > 0}
          onClick={handleSave}
        >
          Сохранить
        </Button>
      </div>

      {unknownNames.length > 0 && (
        <Alert variant="destructive">
          <TriangleAlert />
          <AlertTitle>
            Этих ников нет на сайте: {unknownNames.length}
          </AlertTitle>
          <AlertDescription>
            <p>{unknownNames.join(", ")}</p>
            <p>
              Сохранение не пройдёт, пока они в списке. Уберите их или исправьте
              ник в строке.
            </p>
            <Button
              variant="secondary"
              size="sm"
              className="cursor-pointer"
              onClick={removeUnknown}
            >
              Убрать из списка
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <KillcountDay
        data={rows}
        mode="draft"
        isCanEdit={isCanEdit}
        onDraftChange={setRows}
      />
    </div>
  );
}
