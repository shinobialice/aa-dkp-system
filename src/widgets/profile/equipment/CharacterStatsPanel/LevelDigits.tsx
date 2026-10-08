import { LEVEL_COLOR, LEVEL_FONT, LEVEL_SHADOW } from "./levelStyle";

export default function LevelDigits({ level }: { level: number }) {
  return (
    <span
      style={{
        fontFamily: LEVEL_FONT,
        color: LEVEL_COLOR,
        textShadow: LEVEL_SHADOW,
      }}
      className="text-2xl"
    >
      {level}
    </span>
  );
}
