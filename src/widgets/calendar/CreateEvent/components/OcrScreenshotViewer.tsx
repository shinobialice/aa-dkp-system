"use client";

import { useState, type ReactNode } from "react";
import { Search } from "lucide-react";
import type { RecognizedWord } from "@/utils/AI/handleOcrUpload";
import { cn } from "@/shared/lib/tw-merge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/ui";

export type OcrShot = {
  url: string;
  width: number;
  height: number;
  words: RecognizedWord[];
};

function AssignPopover({
  word,
  userNames,
  onPick,
  children,
}: {
  word: RecognizedWord;
  userNames: string[];
  onPick: (username: string) => void;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const term = search.trim().toLowerCase();
  const options = term
    ? userNames.filter((name) => name.toLowerCase().includes(term)).slice(0, 8)
    : word.candidates;

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) setSearch("");
      }}
    >
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent align="start" className="w-64 p-2">
        <p className="px-1 pb-1.5 text-xs text-muted-foreground">
          Распознано: <b className="text-foreground">{word.text}</b>
        </p>
        <label className="relative mb-1.5 flex items-center">
          <Search className="pointer-events-none absolute left-2 size-3.5 text-muted-foreground" />
          <input
            autoFocus
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Найти игрока"
            aria-label="Найти игрока"
            className="h-8 w-full rounded-md border bg-background pr-2 pl-7 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
          />
        </label>
        {options.length === 0 ? (
          <p className="px-1 py-2 text-center text-xs text-muted-foreground">
            {term ? "Никого не нашлось" : "Похожих ников нет — найдите поиском"}
          </p>
        ) : (
          <ul className="flex flex-col">
            {!term && (
              <li className="px-1 pb-0.5 text-[11px] text-muted-foreground">
                Похожие ники
              </li>
            )}
            {options.map((name) => (
              <li key={name}>
                <button
                  type="button"
                  onClick={() => {
                    onPick(name);
                    setOpen(false);
                    setSearch("");
                  }}
                  className="w-full cursor-pointer rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted"
                >
                  {name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  );
}

function boxStyle(word: RecognizedWord, shot: OcrShot) {
  const box = word.box!;
  const padX = 3;
  const padY = 2;
  return {
    left: `${((box.x - padX) / shot.width) * 100}%`,
    top: `${((box.y - padY) / shot.height) * 100}%`,
    width: `${((box.width + padX * 2) / shot.width) * 100}%`,
    height: `${((box.height + padY * 2) / shot.height) * 100}%`,
  };
}

export default function OcrScreenshotViewer({
  open,
  setOpen,
  shots,
  userNames,
  isSelected,
  onToggle,
  onAssign,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  shots: OcrShot[];
  userNames: string[];
  isSelected: (username: string) => boolean;
  onToggle: (username: string) => void;
  onAssign: (shotIndex: number, wordIndex: number, username: string) => void;
}) {
  const [active, setActive] = useState(0);
  const shotIndex = Math.min(active, shots.length - 1);
  const shot = shots[shotIndex];
  if (!shot) return null;

  const matched = shot.words.filter((word) => word.match);
  const marked = matched.filter((word) => isSelected(word.match!)).length;
  const unmatched = shot.words
    .map((word, index) => ({ word, index }))
    .filter(({ word }) => !word.match);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="flex h-[100dvh] max-h-[100dvh] w-full max-w-none flex-col gap-0 overflow-hidden rounded-none p-0 sm:h-[92dvh] sm:max-w-6xl sm:rounded-2xl">
        <div className="flex shrink-0 flex-col gap-2 border-b px-5 py-3.5 pr-12">
          <DialogTitle className="text-lg">Проверка скриншота</DialogTitle>
          <DialogDescription asChild>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <span className="size-3 rounded-sm border-2 border-green-500 bg-green-500/20" />
                Отмечено {marked}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="size-3 rounded-sm border-2 border-dashed border-zinc-400" />
                Снята отметка {matched.length - marked}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="size-3 rounded-sm border-2 border-amber-500 bg-amber-400/25" />
                Не найдено {unmatched.length}
              </span>
              <span>
                Клик по зелёной рамке снимает отметку, по жёлтой — выбрать
                игрока
              </span>
            </div>
          </DialogDescription>
          {shots.length > 1 && (
            <div role="tablist" className="flex flex-wrap gap-1">
              {shots.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  role="tab"
                  aria-selected={index === shotIndex}
                  onClick={() => setActive(index)}
                  className={cn(
                    "h-8 cursor-pointer rounded-md px-3 text-[13px] font-semibold transition-colors",
                    index === shotIndex
                      ? "bg-foreground text-background"
                      : "bg-muted text-muted-foreground hover:text-foreground",
                  )}
                >
                  Скриншот {index + 1}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="grid min-h-0 flex-1 lg:grid-cols-[minmax(0,1fr)_260px]">
          <div className="min-h-0 overflow-auto bg-muted/40 p-3 [scrollbar-width:thin]">
            <div
              className="relative mx-auto w-full"
              style={{ maxWidth: shot.width }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={shot.url}
                alt={`Скриншот ${shotIndex + 1}`}
                className="block h-auto w-full rounded-md"
              />
              {shot.words.map((word, index) => {
                if (!word.box) return null;
                if (word.match) {
                  const selected = isSelected(word.match);
                  return (
                    <button
                      key={index}
                      type="button"
                      title={`${word.match} — ${selected ? "отмечен, нажмите чтобы снять" : "не отмечен, нажмите чтобы отметить"}`}
                      aria-label={`${word.match}: ${selected ? "снять отметку" : "отметить"}`}
                      onClick={() => onToggle(word.match!)}
                      style={boxStyle(word, shot)}
                      className={cn(
                        "absolute cursor-pointer rounded-[3px] border-2 transition-colors",
                        selected
                          ? "border-green-500 bg-green-500/15 hover:bg-green-500/30"
                          : "border-dashed border-zinc-400 hover:bg-zinc-400/20",
                      )}
                    />
                  );
                }
                return (
                  <AssignPopover
                    key={index}
                    word={word}
                    userNames={userNames}
                    onPick={(name) => onAssign(shotIndex, index, name)}
                  >
                    <button
                      type="button"
                      title={`«${word.text}» — не найден, нажмите чтобы выбрать игрока`}
                      aria-label={`«${word.text}»: выбрать игрока`}
                      style={boxStyle(word, shot)}
                      className="absolute cursor-pointer rounded-[3px] border-2 border-amber-500 bg-amber-400/20 hover:bg-amber-400/40"
                    >
                      <span className="absolute -top-2 -right-2 flex size-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-white">
                        ?
                      </span>
                    </button>
                  </AssignPopover>
                );
              })}
            </div>
          </div>

          <aside className="flex min-h-0 flex-col gap-2 border-t p-4 lg:border-t-0 lg:border-l">
            <span className="text-[13px] font-semibold">
              Не найдено · {unmatched.length}
            </span>
            {unmatched.length === 0 ? (
              <p className="text-[13px] text-muted-foreground">
                Все ники со скриншота нашлись в гильдии
              </p>
            ) : (
              <ul className="flex min-h-0 flex-col gap-1 overflow-y-auto [scrollbar-width:thin]">
                {unmatched.map(({ word, index }) => (
                  <li key={index}>
                    <AssignPopover
                      word={word}
                      userNames={userNames}
                      onPick={(name) => onAssign(shotIndex, index, name)}
                    >
                      <button
                        type="button"
                        className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-md border border-amber-300 bg-amber-50 px-2.5 py-1.5 text-left text-sm hover:bg-amber-100 dark:border-amber-500/40 dark:bg-amber-500/10"
                      >
                        <span className="truncate font-medium">
                          {word.text}
                        </span>
                        <span className="shrink-0 text-xs text-amber-800 dark:text-amber-300">
                          {word.candidates.length > 1
                            ? `${word.candidates.length} похожих`
                            : "выбрать"}
                        </span>
                      </button>
                    </AssignPopover>
                  </li>
                ))}
              </ul>
            )}
            <p className="mt-auto text-xs text-muted-foreground">
              Здесь также могут быть слова, которые не являются никами
              (названия, подписи) — их можно просто пропустить.
            </p>
          </aside>
        </div>
      </DialogContent>
    </Dialog>
  );
}
