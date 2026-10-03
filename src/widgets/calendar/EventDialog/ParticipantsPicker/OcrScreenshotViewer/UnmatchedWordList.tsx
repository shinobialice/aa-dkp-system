import AssignPopover from "./AssignPopover";
import type { IndexedWord } from "./ocrModel";

type Props = {
  words: IndexedWord[];
  userNames: string[];
  onAssign: (wordIndex: number, username: string) => void;
};

export default function UnmatchedWordList({
  words,
  userNames,
  onAssign,
}: Props) {
  return (
    <aside className="flex min-h-0 flex-col gap-2 border-t p-4 lg:border-t-0 lg:border-l">
      <span className="text-sm font-semibold">Не найдено · {words.length}</span>
      <UnmatchedWords words={words} userNames={userNames} onAssign={onAssign} />
      <p className="mt-auto text-xs text-muted-foreground">
        Здесь также могут быть слова, которые не являются никами (названия,
        подписи) — их можно просто пропустить.
      </p>
    </aside>
  );
}

function UnmatchedWords({ words, userNames, onAssign }: Props) {
  if (words.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Все ники со скриншота нашлись в гильдии
      </p>
    );
  }

  return (
    <ul className="flex min-h-0 flex-col gap-1 overflow-y-auto [scrollbar-width:thin]">
      {words.map(({ word, index }) => (
        <li key={index}>
          <AssignPopover
            word={word}
            userNames={userNames}
            onPick={(username) => onAssign(index, username)}
          >
            <button
              type="button"
              className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-md border border-amber-300 bg-amber-50 px-2.5 py-1.5 text-left text-sm hover:bg-amber-100 dark:border-amber-500/40 dark:bg-amber-500/10"
            >
              <span className="truncate font-medium">{word.text}</span>
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
  );
}
