import analyzeImageFromFile, { type OcrBox } from "./analyzeImageFromFile";
import { getActiveUsers } from "@/actions/getActiveUsers";

export type RecognizedWord = {
  text: string;
  box: OcrBox | null;
  match: string | null;
  candidates: string[];
};

export type OcrUploadResult = {
  matchedUserNames: string[];
  unmatchedUserNames: string[];
  words: RecognizedWord[];
  width: number;
  height: number;
};

const LOOKALIKES: Record<string, string> = {
  а: "a",
  в: "b",
  е: "e",
  ё: "e",
  к: "k",
  м: "m",
  н: "h",
  о: "o",
  р: "p",
  с: "c",
  т: "t",
  у: "y",
  х: "x",
};

function fold(value: string) {
  return Array.from(
    value.toLowerCase(),
    (char) => LOOKALIKES[char] ?? char,
  ).join("");
}

function distance(a: string, b: string) {
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i++) {
    let previous = row[0];
    row[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const current = row[j];
      row[j] = Math.min(
        row[j] + 1,
        row[j - 1] + 1,
        previous + (a[i - 1] === b[j - 1] ? 0 : 1),
      );
      previous = current;
    }
  }
  return row[b.length];
}

export function suggestUserNames(text: string, userNames: string[], limit = 5) {
  const query = fold(text);
  return userNames
    .map((name) => {
      const lower = fold(name);
      const prefix = lower.slice(0, Math.max(query.length, 1));
      let score = distance(query, prefix);
      if (lower.startsWith(query)) score = -2;
      else if (lower.includes(query)) score = -1;
      return { name, score };
    })
    .filter(({ score }) => score <= Math.max(2, Math.floor(query.length / 3)))
    .sort((a, b) => a.score - b.score || a.name.localeCompare(b.name, "ru"))
    .slice(0, limit)
    .map(({ name }) => name);
}

const handleOcrUpload = async (file: File): Promise<OcrUploadResult> => {
  const { words: ocrWords, width, height } = await analyzeImageFromFile(file);
  const allUsers = await getActiveUsers();
  const userNames: string[] = allUsers.map((u) => u.username);

  const words: RecognizedWord[] = ocrWords.map((word) => {
    const query = fold(word.name);
    const candidates = userNames.filter((name) => fold(name).startsWith(query));
    if (candidates.length === 1) {
      return {
        text: word.name,
        box: word.box,
        match: candidates[0],
        candidates,
      };
    }
    return {
      text: word.name,
      box: word.box,
      match: null,
      candidates:
        candidates.length > 1
          ? candidates.slice(0, 5)
          : suggestUserNames(word.name, userNames),
    };
  });

  return {
    matchedUserNames: words.flatMap((word) => (word.match ? [word.match] : [])),
    unmatchedUserNames: words.flatMap((word) =>
      word.match ? [] : [word.text],
    ),
    words,
    width,
    height,
  };
};

export default handleOcrUpload;
