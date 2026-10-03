import { cn } from "@/shared/lib/tw-merge";
import type { RecognizedWord } from "@/utils/AI/handleOcrUpload";
import AssignPopover from "./AssignPopover";
import { boxStyle, type OcrShot } from "./ocrModel";

type Props = {
  shot: OcrShot;
  shotIndex: number;
  userNames: string[];
  isSelected: (username: string) => boolean;
  onToggle: (username: string) => void;
  onAssign: (wordIndex: number, username: string) => void;
};

export default function ShotCanvas({
  shot,
  shotIndex,
  userNames,
  isSelected,
  onToggle,
  onAssign,
}: Props) {
  return (
    <div className="min-h-0 overflow-auto bg-muted/40 p-3 [scrollbar-width:thin]">
      <div className="relative mx-auto w-full" style={{ maxWidth: shot.width }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- blob: URL of a local file, next/image cannot load it */}
        <img
          src={shot.url}
          alt={`Скриншот ${shotIndex + 1}`}
          className="block h-auto w-full rounded-md"
        />
        {shot.words.map((word, index) => (
          <WordBox
            key={index}
            word={word}
            shot={shot}
            userNames={userNames}
            isSelected={isSelected}
            onToggle={onToggle}
            onAssign={(username) => onAssign(index, username)}
          />
        ))}
      </div>
    </div>
  );
}

type WordBoxProps = {
  word: RecognizedWord;
  shot: OcrShot;
  userNames: string[];
  isSelected: (username: string) => boolean;
  onToggle: (username: string) => void;
  onAssign: (username: string) => void;
};

function WordBox({
  word,
  shot,
  userNames,
  isSelected,
  onToggle,
  onAssign,
}: WordBoxProps) {
  if (!word.box) return null;
  const style = boxStyle(word.box, shot);

  if (word.match) {
    const match = word.match;
    const selected = isSelected(match);
    return (
      <button
        type="button"
        title={`${match} — ${selected ? "отмечен, нажмите чтобы снять" : "не отмечен, нажмите чтобы отметить"}`}
        aria-label={`${match}: ${selected ? "снять отметку" : "отметить"}`}
        onClick={() => onToggle(match)}
        style={style}
        className={cn(
          "absolute cursor-pointer rounded-sm border-2 transition-colors",
          selected
            ? "border-green-500 bg-green-500/15 hover:bg-green-500/30"
            : "border-dashed border-zinc-400 hover:bg-zinc-400/20",
        )}
      />
    );
  }

  return (
    <AssignPopover word={word} userNames={userNames} onPick={onAssign}>
      <button
        type="button"
        title={`«${word.text}» — не найден, нажмите чтобы выбрать игрока`}
        aria-label={`«${word.text}»: выбрать игрока`}
        style={style}
        className="absolute cursor-pointer rounded-sm border-2 border-amber-500 bg-amber-400/20 hover:bg-amber-400/40"
      >
        <span className="absolute -top-2 -right-2 flex size-4 items-center justify-center rounded-full bg-amber-500 text-2xs font-bold text-white">
          ?
        </span>
      </button>
    </AssignPopover>
  );
}
