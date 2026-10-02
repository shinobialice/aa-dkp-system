"use client";

import { useRef, useState } from "react";
import {
  Check,
  Clock,
  ImageUp,
  Loader2,
  ScanEye,
  Search,
  X,
} from "lucide-react";
import { cn } from "@/shared/lib/tw-merge";
import { Button } from "@/shared/ui";
import handleOcrUpload from "@/utils/AI/handleOcrUpload";
import OcrScreenshotViewer, { type OcrShot } from "./OcrScreenshotViewer";
import { CLASS_ORDER } from "@/widgets/MembersTable/membersModel";
import { classColors } from "@/widgets/MembersTable/classStyles";

export type PickerUser = {
  id: number;
  username: string;
  class: string | null;
  joined_at?: string | null;
  inactive?: boolean;
};

type Tab = "all" | "on" | "off";

const CLASS_PLURAL: Record<string, string> = {
  Бард: "Барды",
  Лук: "Луки",
  Стрелок: "Стрелки",
  Маг: "Маги",
  Милик: "Милики",
  Тактик: "Тактики",
  Танцор: "Танцоры",
  Хил: "Хилы",
};

function joinedTime(user: PickerUser) {
  return user.joined_at ? new Date(user.joined_at).getTime() : Infinity;
}

export default function ParticipantsPicker({
  users,
  rowSelection,
  setRowSelection,
  lateUserIds,
  setLateUserIds,
}: {
  users: PickerUser[];
  rowSelection: Record<number, boolean>;
  setRowSelection: (value: Record<number, boolean>) => void;
  lateUserIds: Record<number, boolean>;
  setLateUserIds: React.Dispatch<React.SetStateAction<Record<number, boolean>>>;
}) {
  const [tab, setTab] = useState<Tab>("all");
  const [search, setSearch] = useState("");
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrError, setOcrError] = useState("");
  const [shots, setShots] = useState<OcrShot[]>([]);
  const [viewerOpen, setViewerOpen] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const indexed = users.map((user, index) => ({ user, index }));
  const selectedCount = indexed.filter(
    ({ index }) => rowSelection[index],
  ).length;
  const lateCount = indexed.filter(
    ({ user, index }) => rowSelection[index] && lateUserIds[user.id],
  ).length;
  const progress = users.length
    ? Math.round((selectedCount / users.length) * 100)
    : 0;

  const term = search.trim().toLowerCase();
  const visible = indexed.filter(({ user, index }) => {
    if (term && !user.username.toLowerCase().includes(term)) return false;
    if (tab === "on") return !!rowSelection[index];
    if (tab === "off") return !rowSelection[index];
    return true;
  });

  const classes = [...CLASS_ORDER, null];
  const groups = classes
    .map((cls) => {
      const inClass = (user: PickerUser) =>
        cls === null
          ? !user.class || !CLASS_ORDER.includes(user.class)
          : user.class === cls;
      const all = indexed.filter(({ user }) => inClass(user));
      return {
        cls,
        title: cls ? (CLASS_PLURAL[cls] ?? cls) : "Без класса",
        selected: all.filter(({ index }) => rowSelection[index]).length,
        total: all.length,
        people: visible
          .filter(({ user }) => inClass(user))
          .sort((a, b) => joinedTime(a.user) - joinedTime(b.user)),
      };
    })
    .filter((group) => group.people.length > 0);

  const toggle = (index: number) => {
    setRowSelection({ ...rowSelection, [index]: !rowSelection[index] });
  };

  const selectAll = () => {
    const next: Record<number, boolean> = {};
    users.forEach((_, index) => (next[index] = true));
    setRowSelection(next);
  };

  const indexByName = new Map(
    users.map((user, index) => [user.username, index] as const),
  );
  const userNames = users
    .filter((user) => !user.inactive)
    .map((user) => user.username);
  const isSelected = (username: string) => {
    const index = indexByName.get(username);
    return index !== undefined && !!rowSelection[index];
  };
  const setUserSelected = (username: string, selected: boolean) => {
    const index = indexByName.get(username);
    if (index === undefined) return;
    setRowSelection({ ...rowSelection, [index]: selected });
  };

  const words = shots.flatMap((shot) => shot.words);
  const shotMatched = new Set(
    words.flatMap((word) => (word.match ? [word.match] : [])),
  );
  const shotMarked = Array.from(shotMatched).filter(isSelected).length;
  const shotUnmatched = words.filter((word) => !word.match).length;

  const handleFiles = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files ?? []);
    event.target.value = "";
    if (files.length === 0) return;
    setOcrLoading(true);
    setOcrError("");
    try {
      const results = await Promise.all(
        files.map((file) => handleOcrUpload(file)),
      );
      const matched = new Set<string>();
      results.forEach(({ matchedUserNames }) =>
        matchedUserNames.forEach((name) => matched.add(name)),
      );
      const next: Record<number, boolean> = {};
      users.forEach((user, index) => {
        if (!user.inactive && matched.has(user.username)) next[index] = true;
      });
      setRowSelection(next);
      shots.forEach((shot) => URL.revokeObjectURL(shot.url));
      setShots(
        results.map((result, index) => ({
          url: URL.createObjectURL(files[index]),
          width: result.width,
          height: result.height,
          words: result.words,
        })),
      );
      setViewerOpen(true);
    } catch (error) {
      setOcrError(
        error instanceof Error ? error.message : "Ошибка распознавания",
      );
    } finally {
      setOcrLoading(false);
    }
  };

  const assignWord = (
    shotIndex: number,
    wordIndex: number,
    username: string,
  ) => {
    setShots((previous) =>
      previous.map((shot, i) =>
        i === shotIndex
          ? {
              ...shot,
              words: shot.words.map((word, j) =>
                j === wordIndex ? { ...word, match: username } : word,
              ),
            }
          : shot,
      ),
    );
    setUserSelected(username, true);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-2.5">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex min-w-40 flex-1 flex-col gap-1">
          <span className="text-[15px] font-bold">
            Участники{" "}
            <span className="text-green-700 dark:text-green-400">
              {selectedCount}
            </span>{" "}
            <span className="font-medium text-muted-foreground">
              из {users.length}
            </span>
            {lateCount > 0 && (
              <span className="text-[12.5px] font-medium whitespace-nowrap text-amber-700 dark:text-amber-400">
                {" "}
                · опоздали {lateCount}
              </span>
            )}
          </span>
          <span className="block h-[5px] overflow-hidden rounded-full bg-muted">
            <span
              className="block h-full rounded-full bg-green-600"
              style={{ width: `${progress}%` }}
            />
          </span>
        </div>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleFiles}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={ocrLoading}
          onClick={() => fileRef.current?.click()}
          className="cursor-pointer"
        >
          {ocrLoading ? <Loader2 className="animate-spin" /> : <ImageUp />}
          Со скриншота
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={selectAll}
          className="cursor-pointer"
        >
          Отметить всех
        </Button>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setRowSelection({})}
          className="cursor-pointer"
        >
          Снять всех
        </Button>
      </div>

      {ocrLoading && (
        <p className="flex items-center gap-2 rounded-lg bg-muted/60 px-3 py-2 text-[13px] text-muted-foreground">
          <Loader2 className="size-4 animate-spin" />
          Распознаю скриншоты…
        </p>
      )}
      {ocrError && (
        <p className="rounded-lg bg-destructive/10 px-3 py-2 text-[13px] text-destructive">
          {ocrError}
        </p>
      )}
      {shots.length > 0 && !ocrLoading && (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-[13px] dark:border-blue-500/30 dark:bg-blue-500/10">
          <span className="min-w-0 flex-1 text-blue-900 dark:text-blue-200">
            <b>
              Со{" "}
              {shots.length === 1 ? "скриншота" : `${shots.length} скриншотов`}:
              отмечено {shotMarked}
            </b>
            {shotUnmatched > 0 && ` · не найдено ${shotUnmatched}`}
          </span>
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setViewerOpen(true)}
            className="h-8 cursor-pointer border-blue-300 bg-white text-blue-900 hover:bg-blue-100 dark:border-blue-500/40 dark:bg-transparent dark:text-blue-200"
          >
            <ScanEye />
            Проверить на скриншоте
          </Button>
          <button
            type="button"
            aria-label="Скрыть"
            onClick={() => {
              shots.forEach((shot) => URL.revokeObjectURL(shot.url));
              setShots([]);
            }}
            className="cursor-pointer text-blue-900/60 hover:text-blue-900 dark:text-blue-200/60"
          >
            <X className="size-4" />
          </button>
        </div>
      )}

      <OcrScreenshotViewer
        open={viewerOpen}
        setOpen={setViewerOpen}
        shots={shots}
        userNames={userNames}
        isSelected={isSelected}
        onToggle={(username) =>
          setUserSelected(username, !isSelected(username))
        }
        onAssign={assignWord}
      />

      <div className="flex flex-wrap items-center gap-2">
        <div
          role="tablist"
          className="inline-flex gap-0.5 rounded-lg bg-muted p-[3px]"
        >
          {(
            [
              ["all", "Все", users.length],
              ["on", "Отмечены", selectedCount],
              ["off", "Не отмечены", users.length - selectedCount],
            ] as [Tab, string, number][]
          ).map(([key, label, count]) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={tab === key}
              onClick={() => setTab(key)}
              className={cn(
                "h-[30px] cursor-pointer rounded-md px-2.5 text-[12.5px] font-semibold transition-colors",
                tab === key
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground",
              )}
            >
              {label}{" "}
              <span className="font-medium text-muted-foreground">{count}</span>
            </button>
          ))}
        </div>
        <label className="relative flex min-w-40 flex-1 items-center">
          <Search className="pointer-events-none absolute left-2.5 size-3.5 text-muted-foreground" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Найти игрока"
            aria-label="Найти игрока"
            className="h-9 w-full rounded-lg border bg-background pr-2 pl-8 text-sm outline-none focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/40"
          />
        </label>
      </div>

      <div className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto pr-1 [scrollbar-width:thin]">
        {groups.length === 0 && (
          <p className="py-6 text-center text-sm text-muted-foreground">
            Никого не нашлось
          </p>
        )}
        {groups.map((group) => (
          <div key={group.title} className="flex flex-col gap-1.5">
            <span className="flex items-center gap-1.5 text-[12.5px] font-bold text-foreground/80">
              <span
                className="size-2 rounded-full bg-muted-foreground"
                style={
                  group.cls
                    ? { backgroundColor: classColors[group.cls] }
                    : undefined
                }
              />
              {group.title}
              <span className="font-medium text-muted-foreground">
                {group.selected} / {group.total}
              </span>
            </span>
            <div className="flex flex-wrap gap-1.5">
              {group.people.map(({ user, index }) => {
                const selected = !!rowSelection[index];
                const late = selected && !!lateUserIds[user.id];
                const color = user.class ? classColors[user.class] : undefined;
                return (
                  <span
                    key={user.id}
                    style={
                      selected && color
                        ? {
                            backgroundColor: `color-mix(in srgb, ${color} 14%, transparent)`,
                            borderColor: `color-mix(in srgb, ${color} 50%, transparent)`,
                          }
                        : undefined
                    }
                    className={cn(
                      "inline-flex items-center overflow-hidden rounded-full border",
                      selected
                        ? "border-foreground/30 bg-muted"
                        : "bg-background",
                    )}
                  >
                    <button
                      type="button"
                      aria-pressed={selected}
                      onClick={() => toggle(index)}
                      className={cn(
                        "inline-flex h-8 cursor-pointer items-center gap-1.5 pr-2.5 pl-2 text-[13px] font-medium",
                        !selected &&
                          "text-muted-foreground hover:text-foreground",
                      )}
                    >
                      <span
                        style={
                          selected && color
                            ? { backgroundColor: color, borderColor: color }
                            : undefined
                        }
                        className={cn(
                          "flex size-4 items-center justify-center rounded border-[1.5px] text-white",
                          selected
                            ? "border-foreground bg-foreground"
                            : "border-muted-foreground/40",
                        )}
                      >
                        {selected && <Check className="size-3" />}
                      </span>
                      {user.username}
                      {user.inactive && (
                        <span className="text-[11px] font-normal text-muted-foreground">
                          не активен
                        </span>
                      )}
                    </button>
                    {selected && (
                      <button
                        type="button"
                        aria-pressed={late}
                        aria-label={
                          late
                            ? `${user.username}: опоздал, снять`
                            : `${user.username}: отметить опоздание`
                        }
                        title={late ? "Опоздал — снять" : "Отметить опоздание"}
                        onClick={() =>
                          setLateUserIds((prev) => ({
                            ...prev,
                            [user.id]: !prev[user.id],
                          }))
                        }
                        style={
                          color
                            ? {
                                borderColor: `color-mix(in srgb, ${color} 50%, transparent)`,
                              }
                            : undefined
                        }
                        className={cn(
                          "flex h-8 w-[30px] cursor-pointer items-center justify-center border-l",
                          late
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
                            : "text-muted-foreground/60 hover:text-foreground",
                        )}
                      >
                        <Clock className="size-3.5" />
                      </button>
                    )}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
