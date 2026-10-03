import type { RecognizedWord } from "@/utils/AI/handleOcrUpload";

export type OcrShot = {
  url: string;
  width: number;
  height: number;
  words: RecognizedWord[];
};

export type IndexedWord = { word: RecognizedWord; index: number };

type WordBox = NonNullable<RecognizedWord["box"]>;

const PAD_X = 3;
const PAD_Y = 2;

export function boxStyle(box: WordBox, shot: OcrShot) {
  return {
    left: `${((box.x - PAD_X) / shot.width) * 100}%`,
    top: `${((box.y - PAD_Y) / shot.height) * 100}%`,
    width: `${((box.width + PAD_X * 2) / shot.width) * 100}%`,
    height: `${((box.height + PAD_Y * 2) / shot.height) * 100}%`,
  };
}

export function shotStats(
  shot: OcrShot,
  isSelected: (username: string) => boolean,
) {
  const matchedNames = shot.words.flatMap((word) =>
    word.match ? [word.match] : [],
  );
  const marked = matchedNames.filter(isSelected).length;
  const unmatched = shot.words
    .map((word, index) => ({ word, index }))
    .filter(({ word }) => !word.match);
  return {
    marked,
    unmarked: matchedNames.length - marked,
    unmatched,
  };
}
