"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";
import {
  getIconMatchList,
  setItemIconUrl,
  uploadItemTypeIcon,
  uploadGradeIcon,
  uploadSealIcon,
} from "@/actions/itemTypeAdmin";
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/shared/ui";

type ResultRow = {
  file: string;
  status: "ok" | "skip" | "error";
  detail: string;
};

const GRADE_FILE_RE = /^icon_grade(\d{1,2})\.(png|jpe?g|webp|gif)$/i;
// Иконка печати профиля (SEAL_ICON_URL) — единственная захардкоженная
// картинка вне item_type/грейдов, поэтому матчится по имени отдельно.
const SEAL_ICON_FILE = "icon_item_5888.png";

function basename(url: string | null): string | null {
  if (!url) return null;
  const clean = url.split("?")[0];
  return clean.slice(clean.lastIndexOf("/") + 1) || null;
}

// Массовая перезаливка иконок предметов (и 12 рамок редкости) с внешнего
// хоста на свой: сопоставляет выбранные файлы по ИМЕНИ с текущим icon_url
// каждого предмета (например "icon_item_4383.png" совпадёт со строкой
// ".../icon_item_4383.png") и заливает через тот же механизм, что и обычная
// загрузка одной иконки в форме предмета — просто одним заходом на много
// файлов сразу. Один и тот же remote-файл может быть у нескольких предметов
// (дубли имени) — обновляются все совпавшие строки.
export function BulkIconUploadDialog({
  open,
  onClose,
  onDone,
}: {
  open: boolean;
  onClose: () => void;
  onDone: () => void;
}) {
  const [running, setRunning] = useState(false);
  const [results, setResults] = useState<ResultRow[] | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (fileList: FileList) => {
    setRunning(true);
    setResults(null);
    const rows: ResultRow[] = [];
    try {
      const items = await getIconMatchList();
      const byBasename = new Map<string, number[]>();
      for (const item of items) {
        const b = basename(item.icon_url);
        if (!b) continue;
        const list = byBasename.get(b) ?? [];
        list.push(item.id);
        byBasename.set(b, list);
      }

      for (const file of Array.from(fileList)) {
        const gradeMatch = file.name.match(GRADE_FILE_RE);
        try {
          if (gradeMatch) {
            const grade = Number(gradeMatch[1]);
            const fd = new FormData();
            fd.append("file", file);
            await uploadGradeIcon(grade, fd);
            rows.push({ file: file.name, status: "ok", detail: `рамка редкости ${grade}` });
            continue;
          }

          if (file.name.toLowerCase() === SEAL_ICON_FILE) {
            const fd = new FormData();
            fd.append("file", file);
            await uploadSealIcon(fd);
            rows.push({ file: file.name, status: "ok", detail: "иконка печати профиля" });
            continue;
          }

          const ids = byBasename.get(file.name);
          if (!ids || ids.length === 0) {
            rows.push({ file: file.name, status: "skip", detail: "не найден предмет с таким файлом в icon_url" });
            continue;
          }

          const fd = new FormData();
          fd.append("file", file);
          const newUrl = await uploadItemTypeIcon(fd);
          for (const id of ids) {
            await setItemIconUrl(id, newUrl);
          }
          rows.push({
            file: file.name,
            status: "ok",
            detail: `обновлено предметов: ${ids.length} (id ${ids.join(", ")})`,
          });
        } catch (error) {
          rows.push({
            file: file.name,
            status: "error",
            detail: error instanceof Error ? error.message : "ошибка загрузки",
          });
        }
        setResults([...rows]);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Не удалось получить список предметов",
      );
    } finally {
      setResults([...rows]);
      setRunning(false);
      onDone();
    }
  };

  const okCount = results?.filter((r) => r.status === "ok").length ?? 0;
  const skipCount = results?.filter((r) => r.status === "skip").length ?? 0;
  const errorCount = results?.filter((r) => r.status === "error").length ?? 0;

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o && !running) onClose();
      }}
    >
      <DialogContent aria-describedby={undefined} className="sm:max-w-[560px]">
        <DialogHeader>
          <DialogTitle>Перезалить иконки пакетно</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-3 py-2">
          <p className="text-sm text-muted-foreground">
            Выбери сразу все файлы (имена должны совпадать с текущей ссылкой
            на иконку — например «icon_item_4383.png» или «icon_grade1.png»).
            Каждый файл зальётся на этот сервер и заменит внешнюю ссылку у
            всех предметов, где она совпала.
          </p>
          <input
            ref={inputRef}
            type="file"
            multiple
            accept="image/png,image/jpeg,image/webp,image/gif"
            disabled={running}
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                handleFiles(e.target.files);
              }
            }}
          />
          {running && (
            <p className="text-sm text-muted-foreground">
              Загрузка... {results?.length ?? 0} обработано
            </p>
          )}
          {results && !running && (
            <p className="text-sm">
              Готово: {okCount} загружено, {skipCount} пропущено (нет совпадения), {errorCount} ошибок
            </p>
          )}
          {results && results.length > 0 && (
            <div className="max-h-64 overflow-y-auto rounded border text-sm">
              {results.map((r, i) => (
                <div
                  key={i}
                  className={`flex items-start gap-2 border-b px-2 py-1 last:border-b-0 ${
                    r.status === "error"
                      ? "text-destructive"
                      : r.status === "skip"
                        ? "text-muted-foreground"
                        : ""
                  }`}
                >
                  <span className="shrink-0">
                    {r.status === "ok" ? "✅" : r.status === "skip" ? "⏭️" : "❌"}
                  </span>
                  <span className="shrink-0 font-mono">{r.file}</span>
                  <span className="truncate">{r.detail}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <DialogFooter>
          <Button
            className="cursor-pointer"
            variant="secondary"
            disabled={running}
            onClick={() => {
              setResults(null);
              if (inputRef.current) inputRef.current.value = "";
              onClose();
            }}
          >
            Закрыть
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
