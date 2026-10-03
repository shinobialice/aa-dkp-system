import { LEVEL_COLOR, LEVEL_FONT } from "./levelStyle";

export default function LevelDigits({ level }: { level: number }) {
  return (
    <span
      style={{ fontFamily: LEVEL_FONT, color: LEVEL_COLOR }}
      className="text-2xl"
    >
      {level}
    </span>
  );
}
